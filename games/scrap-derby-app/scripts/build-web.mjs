// Builds www/ for Capacitor: the game is one HTML file (src/index.html) that loads three.js and
// fonts from CDNs on the web. The app must work offline, so this swaps those for local copies.
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
const nm = join(root, 'node_modules');
rmSync(www, { recursive: true, force: true });
mkdirSync(join(www, 'vendor'), { recursive: true });

// three.js r128 (same build the web version pins)
copyFileSync(join(nm, 'three/build/three.min.js'), join(www, 'vendor/three.min.js'));

// fonts: only the weights the game uses, woff2 only
const FONTS = [
  ['russo-one', [400]],
  ['chakra-petch', [500, 600, 700]],
  ['do-hyeon', [400]],
  ['ibm-plex-sans-kr', [400, 600]]
];
let css = '';
for (const [pkg, weights] of FONTS) {
  const src = join(nm, '@fontsource', pkg);
  const out = join(www, 'fonts', pkg);
  mkdirSync(join(out, 'files'), { recursive: true });
  for (const w of weights) {
    const file = w === 400 && existsSync(join(src, '400.css')) ? '400.css' : `${w}.css`;
    // keep only woff2 sources so missing .woff files are never requested
    const body = readFileSync(join(src, file), 'utf8').replace(/,\s*url\([^)]*\.woff\)\s*format\('woff'\)/g, '');
    writeFileSync(join(out, `${w}.css`), body);
    css += `@import url('./${pkg}/${w}.css');\n`;
    for (const f of readdirSync(join(src, 'files'))) {
      if (f.endsWith(`-${w}-normal.woff2`)) copyFileSync(join(src, 'files', f), join(out, 'files', f));
    }
  }
}
writeFileSync(join(www, 'fonts/fonts.css'), css);

// html: swap CDN tags for local files
let html = readFileSync(join(root, 'src/index.html'), 'utf8');
const before = html;
html = html.replace(/<link rel="preconnect"[^>]*>\n?/g, '');
html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^"]*">/, '<link rel="stylesheet" href="fonts/fonts.css">');
html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"><\/script>/, '<script src="vendor/three.min.js"></script>');
if (html === before || /cdnjs|fonts\.googleapis/.test(html)) throw new Error('build-web: CDN references not fully replaced, check src/index.html');
writeFileSync(join(www, 'index.html'), html);
console.log('www/ built:', readdirSync(www).join(', '));
