#!/usr/bin/env node

import { execFile } from "node:child_process";
import {
  readdir,
  readFile,
  stat,
} from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath, pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const distRoot = path.join(root, "dist", "office-skills");
const catalogPath = path.join(scriptDir, "skill-catalog.mjs");
const sourceMapPath = path.join(root, "office-adaptation", "source-map.mjs");

const expectedSkillCount = 64;
const expectedSourceCount = 121;
const upstreamCategories = new Set([
  "codex",
  "customer-support",
  "game-development",
  "media",
  "ui",
  "web-design",
]);
const sourceEntryKeys = [
  "disposition",
  "officeUse",
  "primary",
  "sourceName",
  "sourcePath",
  "targetSkills",
];
const requiredReferences = [
  "office-output-contract.md",
  "word-production.md",
  "powerpoint-production.md",
  "excel-production.md",
  "korean-business-documents.md",
  "tool-routing.md",
  "external-references.md",
  "execution-runtime.md",
  "financial-model-patterns.md",
  "proposal-deck-patterns.md",
  "rfp-response-patterns.md",
  "verification-evidence.md",
  "evidence-report.schema.json",
];
const requiredRuntimeScripts = [
  "export_office.ps1",
  "office_preflight.ps1",
  "requirements-validation.txt",
  "scan_office.py",
  "validate_evidence_report.py",
  "validate_ooxml.py",
];

const errors = [];

function reject(message) {
  errors.push(message);
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function sameItems(left, right) {
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  );
}

function compareSets(actual, expected, label) {
  for (const item of [...expected].sort()) {
    if (!actual.has(item)) {
      reject(`${label} is missing: ${item}`);
    }
  }
  for (const item of [...actual].sort()) {
    if (!expected.has(item)) {
      reject(`${label} has an unexpected item: ${item}`);
    }
  }
}

async function pathType(filePath) {
  try {
    const info = await stat(filePath);
    if (info.isFile()) return "file";
    if (info.isDirectory()) return "directory";
    return "other";
  } catch (error) {
    if (error?.code === "ENOENT") return "missing";
    reject(`Cannot inspect ${relative(filePath)}: ${error.message}`);
    return "error";
  }
}

async function readRequiredText(filePath) {
  if ((await pathType(filePath)) !== "file") {
    reject(`Required file is missing: ${relative(filePath)}`);
    return null;
  }
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    reject(`Cannot read ${relative(filePath)}: ${error.message}`);
    return null;
  }
}

async function importRequiredModule(filePath, label) {
  if ((await pathType(filePath)) !== "file") {
    reject(`${label} is missing: ${relative(filePath)}`);
    return null;
  }
  try {
    return await import(pathToFileURL(filePath).href);
  } catch (error) {
    reject(`Cannot import ${relative(filePath)}: ${error.message}`);
    return null;
  }
}

function validateCatalog(module) {
  if (!module) return null;

  const { categoryOrder, skills } = module;
  if (!Array.isArray(skills)) {
    reject("scripts/skill-catalog.mjs must export skills as an array.");
    return null;
  }
  if (!Array.isArray(categoryOrder)) {
    reject("scripts/skill-catalog.mjs must export categoryOrder as an array.");
    return null;
  }
  if (skills.length !== expectedSkillCount) {
    reject(
      `Skill catalog must contain ${expectedSkillCount} skills; found ${skills.length}.`,
    );
  }

  const categorySet = new Set();
  for (const category of categoryOrder) {
    if (
      typeof category !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category)
    ) {
      reject(`Invalid categoryOrder value: ${JSON.stringify(category)}`);
      continue;
    }
    if (categorySet.has(category)) {
      reject(`Duplicate categoryOrder value: ${category}`);
    }
    categorySet.add(category);
  }

  const byName = new Map();
  for (const [index, skill] of skills.entries()) {
    const itemLabel = `skills[${index}]`;
    if (!skill || typeof skill !== "object" || Array.isArray(skill)) {
      reject(`${itemLabel} must be an object.`);
      continue;
    }

    const { category, description, name, short } = skill;
    if (typeof category !== "string" || !categorySet.has(category)) {
      reject(`${itemLabel} has an unknown category: ${JSON.stringify(category)}`);
    }
    if (
      typeof name !== "string" ||
      name.length > 64 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)
    ) {
      reject(`${itemLabel} has an invalid lowercase hyphen-case name.`);
      continue;
    }
    if (byName.has(name)) {
      reject(`Duplicate skill name: ${name}`);
    } else {
      byName.set(name, skill);
    }
    if (
      typeof description !== "string" ||
      description.trim().length === 0 ||
      description.length > 1024 ||
      !description.includes("Use ")
    ) {
      reject(
        `${name} must have a nonempty description of at most 1024 characters with a Use trigger.`,
      );
    }
    if (
      typeof short !== "string" ||
      short.length < 25 ||
      short.length > 64
    ) {
      reject(`${name} must have a 25-64 character short description.`);
    }
  }

  for (const category of categorySet) {
    if (!skills.some((skill) => skill?.category === category)) {
      reject(`categoryOrder includes an unused category: ${category}`);
    }
  }

  return { byName, categoryOrder, skills };
}

function sourcePathParts(sourcePath) {
  if (typeof sourcePath !== "string") return null;
  const match =
    /^agent-skills\/([^/]+)\/([^/]+)\/SKILL\.md$/.exec(sourcePath);
  if (!match || !upstreamCategories.has(match[1])) return null;
  return { category: match[1], name: match[2] };
}

async function trackedSourcePaths(sourceCommit) {
  try {
    const { stdout } = await execFileAsync(
      "git",
      [
        "ls-tree",
        "-r",
        "--name-only",
        sourceCommit,
        "--",
        "agent-skills",
      ],
      { cwd: root, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 },
    );
    return new Set(
      stdout
        .split(/\r?\n/)
        .map((item) => item.trim().replaceAll("\\", "/"))
        .filter((item) => sourcePathParts(item)),
    );
  } catch (error) {
    reject(
      `Cannot enumerate upstream skills at sourceCommit ${sourceCommit}: ${error.message}`,
    );
    return null;
  }
}

async function validateSourceMap(module, catalog) {
  if (!module || !catalog) return;

  const { entries, sourceCommit } = module;
  if (
    typeof sourceCommit !== "string" ||
    !/^[0-9a-f]{40}$/.test(sourceCommit)
  ) {
    reject("office-adaptation/source-map.mjs must export a full Git sourceCommit.");
    return;
  }
  if (!Array.isArray(entries)) {
    reject("office-adaptation/source-map.mjs must export entries as an array.");
    return;
  }
  if (entries.length !== expectedSourceCount) {
    reject(
      `Source map must contain ${expectedSourceCount} entries; found ${entries.length}.`,
    );
  }

  const mappedPaths = new Set();
  for (const [index, entry] of entries.entries()) {
    const label = `source-map entries[${index}]`;
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      reject(`${label} must be an object.`);
      continue;
    }

    const keys = Object.keys(entry).sort();
    if (!sameItems(keys, sourceEntryKeys)) {
      reject(
        `${label} keys must be exactly: ${sourceEntryKeys.join(", ")}.`,
      );
    }

    const {
      disposition,
      officeUse,
      primary,
      sourceName,
      sourcePath,
      targetSkills,
    } = entry;
    const parts = sourcePathParts(sourcePath);
    if (!parts) {
      reject(`${label} has an invalid upstream sourcePath.`);
    } else if (sourceName !== parts.name) {
      reject(
        `${label} sourceName ${JSON.stringify(sourceName)} does not match ${parts.name}.`,
      );
    }
    if (typeof sourceName !== "string" || sourceName.length === 0) {
      reject(`${label} must have a nonempty sourceName.`);
    }
    if (typeof sourcePath === "string") {
      if (mappedPaths.has(sourcePath)) {
        reject(`Duplicate source-map sourcePath: ${sourcePath}`);
      }
      mappedPaths.add(sourcePath);
    }
    if (!["adapt", "preserve-reference"].includes(disposition)) {
      reject(`${label} has an invalid disposition: ${JSON.stringify(disposition)}`);
    }
    if (typeof officeUse !== "string" || officeUse.trim().length === 0) {
      reject(`${label} must have a nonempty officeUse.`);
    }
    if (
      typeof primary !== "string" ||
      !catalog.categoryOrder.includes(primary)
    ) {
      reject(`${label} primary must name a catalog category.`);
    }
    if (!Array.isArray(targetSkills)) {
      reject(`${label} targetSkills must be an array.`);
      continue;
    }
    if (targetSkills.length === 0) {
      reject(`${label} targetSkills must contain at least one skill.`);
    }

    const targets = new Set();
    for (const target of targetSkills) {
      if (typeof target !== "string" || !catalog.byName.has(target)) {
        reject(`${label} references an unknown target skill: ${JSON.stringify(target)}`);
      } else if (targets.has(target)) {
        reject(`${label} repeats target skill: ${target}`);
      }
      targets.add(target);
    }
  }

  const originals = await trackedSourcePaths(sourceCommit);
  if (originals) {
    if (originals.size !== expectedSourceCount) {
      reject(
        `sourceCommit must contain ${expectedSourceCount} upstream skills in the six original categories; found ${originals.size}.`,
      );
    }
    compareSets(mappedPaths, originals, "Source-map coverage");
  }
}

function parseYamlScalar(rawValue, label) {
  const value = rawValue.trim();
  if (value.startsWith('"')) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== "string") throw new Error("not a string");
      return parsed;
    } catch {
      reject(`${label} has an invalid double-quoted string.`);
      return null;
    }
  }
  if (value.startsWith("'")) {
    if (value.length < 2 || !value.endsWith("'")) {
      reject(`${label} has an invalid single-quoted string.`);
      return null;
    }
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

function parseFrontmatter(text, label) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    reject(`${label} must start with YAML frontmatter.`);
    return null;
  }
  const end = lines.findIndex(
    (line, index) => index > 0 && line.trim() === "---",
  );
  if (end === -1) {
    reject(`${label} has unclosed YAML frontmatter.`);
    return null;
  }

  const values = new Map();
  for (let index = 1; index < end; index += 1) {
    const line = lines[index];
    if (line.trim().length === 0) continue;
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) {
      reject(`${label} has unsupported frontmatter on line ${index + 1}.`);
      continue;
    }
    const [, key, rawValue] = match;
    if (values.has(key)) {
      reject(`${label} repeats frontmatter key: ${key}`);
      continue;
    }
    values.set(key, parseYamlScalar(rawValue, `${label} frontmatter ${key}`));
  }
  compareSets(new Set(values.keys()), new Set(["name", "description"]), `${label} frontmatter`);
  return values;
}

function parseOpenAiYaml(text, label) {
  const values = new Map();
  let interfaceSeen = false;
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    if (line.trim().length === 0 || line.trimStart().startsWith("#")) continue;
    if (/^interface:\s*$/.test(line)) {
      if (interfaceSeen) reject(`${label} repeats interface.`);
      interfaceSeen = true;
      continue;
    }

    const match = /^  ([a-z_]+):\s*(.+)$/.exec(line);
    if (!interfaceSeen || !match) {
      reject(`${label} has unsupported YAML on line ${index + 1}.`);
      continue;
    }
    const [, key, rawValue] = match;
    if (values.has(key)) {
      reject(`${label} repeats interface key: ${key}`);
      continue;
    }
    const value = rawValue.trim();
    if (
      !(
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      )
    ) {
      reject(`${label} interface.${key} must be quoted.`);
      continue;
    }
    values.set(
      key,
      parseYamlScalar(value, `${label} interface.${key}`),
    );
  }

  if (!interfaceSeen) reject(`${label} is missing interface.`);
  compareSets(
    new Set(values.keys()),
    new Set(["display_name", "short_description", "default_prompt"]),
    `${label} interface`,
  );
  return values;
}

function markdownTargets(text) {
  return [...text.matchAll(/\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g)]
    .map((match) => match[1].replace(/^<|>$/g, ""));
}

function isInside(candidate, parent) {
  const result = path.relative(parent, candidate);
  return result === "" || (!result.startsWith(`..${path.sep}`) && result !== ".." && !path.isAbsolute(result));
}

async function validateReferenceLinks(skillFile, text, referencesRoot) {
  const label = relative(skillFile);
  const linkedReferences = [];
  const internalLinks = [];

  for (const rawTarget of markdownTargets(text)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget) || rawTarget.startsWith("#")) {
      continue;
    }
    const withoutFragment = rawTarget.split(/[?#]/, 1)[0];
    let decoded;
    try {
      decoded = decodeURIComponent(withoutFragment).replaceAll("/", path.sep);
    } catch {
      reject(`${label} has an invalid encoded link: ${rawTarget}`);
      continue;
    }
    const resolved = path.resolve(path.dirname(skillFile), decoded);
    if (!isInside(resolved, distRoot)) {
      reject(`${label} has a link outside the distribution: ${rawTarget}`);
      continue;
    }
    internalLinks.push({ rawTarget, resolved });
    if (isInside(resolved, referencesRoot)) {
      linkedReferences.push({ rawTarget, resolved });
    }
  }

  if (linkedReferences.length === 0) {
    reject(`${label} must link to at least one copied reference.`);
  }
  for (const { rawTarget, resolved } of internalLinks) {
    if ((await pathType(resolved)) !== "file") {
      reject(`${label} links to a missing distribution file: ${rawTarget}`);
    }
  }
}

async function directoryNames(directory, label) {
  try {
    const items = await readdir(directory, { withFileTypes: true });
    return new Set(
      items.filter((item) => item.isDirectory()).map((item) => item.name),
    );
  } catch (error) {
    reject(`Cannot enumerate ${label}: ${error.message}`);
    return null;
  }
}

async function validateSkillFiles(catalog, referencesRoot) {
  const agentSkillsRoot = path.join(distRoot, "agent-skills");
  if ((await pathType(agentSkillsRoot)) !== "directory") {
    reject("dist/office-skills/agent-skills must be a directory.");
    return;
  }

  const expectedCategories = new Set(catalog.categoryOrder);
  const actualCategories = await directoryNames(
    agentSkillsRoot,
    "dist/office-skills/agent-skills",
  );
  if (actualCategories) {
    compareSets(actualCategories, expectedCategories, "Generated skill categories");
  }

  const referencesChecks = [];
  for (const category of catalog.categoryOrder) {
    const categoryRoot = path.join(agentSkillsRoot, category);
    const expectedNames = new Set(
      catalog.skills
        .filter((skill) => skill.category === category)
        .map((skill) => skill.name),
    );
    const actualNames = await directoryNames(
      categoryRoot,
      `generated category ${category}`,
    );
    if (actualNames) {
      compareSets(actualNames, expectedNames, `Generated ${category} skill folders`);
    }

    for (const skill of catalog.skills.filter(
      (item) => item.category === category,
    )) {
      const skillRoot = path.join(categoryRoot, skill.name);
      const skillFile = path.join(skillRoot, "SKILL.md");
      const openAiFile = path.join(skillRoot, "agents", "openai.yaml");
      const [skillText, openAiText] = await Promise.all([
        readRequiredText(skillFile),
        readRequiredText(openAiFile),
      ]);

      if (skillText !== null) {
        if (!skillText.includes("\n## Runtime boundary\n")) {
          reject(`${relative(skillFile)} is missing its runtime boundary.`);
        }
        const frontmatter = parseFrontmatter(skillText, relative(skillFile));
        if (frontmatter) {
          if (frontmatter.get("name") !== skill.name) {
            reject(
              `${relative(skillFile)} frontmatter name must match its folder and catalog name ${skill.name}.`,
            );
          }
          if (frontmatter.get("description") !== skill.description) {
            reject(
              `${relative(skillFile)} frontmatter description does not match the catalog.`,
            );
          }
        }
        referencesChecks.push(
          validateReferenceLinks(skillFile, skillText, referencesRoot),
        );
      }

      if (openAiText !== null) {
        const values = parseOpenAiYaml(openAiText, relative(openAiFile));
        if (values.get("display_name") !== skill.title) {
          reject(`${relative(openAiFile)} display_name does not match the catalog.`);
        }
        if (values.get("short_description") !== skill.short) {
          reject(
            `${relative(openAiFile)} short_description does not match the catalog.`,
          );
        }
        const prompt = values.get("default_prompt");
        const token = new RegExp(
          `\\$${skill.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9-])`,
        );
        if (typeof prompt !== "string" || !token.test(prompt)) {
          reject(
            `${relative(openAiFile)} default_prompt must contain the exact $${skill.name} token.`,
          );
        }
      }
    }
  }
  await Promise.all(referencesChecks);
}

async function validateRequiredReferences() {
  const referencesRoot = path.join(distRoot, "references");
  if ((await pathType(referencesRoot)) !== "directory") {
    reject("dist/office-skills/references must be a directory.");
    return referencesRoot;
  }
  await Promise.all(
    requiredReferences.map(async (name) => {
      const referencePath = path.join(referencesRoot, name);
      if ((await pathType(referencePath)) !== "file") {
        reject(`Required copied reference is missing: references/${name}`);
      }
    }),
  );
  return referencesRoot;
}

async function validateRuntimeFiles() {
  const scriptsRoot = path.join(distRoot, "scripts");
  if ((await pathType(scriptsRoot)) !== "directory") {
    reject("dist/office-skills/scripts must be a directory.");
    return;
  }

  await Promise.all(
    requiredRuntimeScripts.map(async (name) => {
      const generatedPath = path.join(scriptsRoot, name);
      const sourcePath = path.join(root, "scripts", name);
      if ((await pathType(generatedPath)) !== "file") {
        reject(`Required runtime script is missing: scripts/${name}`);
        return;
      }
      try {
        const [generated, source] = await Promise.all([
          readFile(generatedPath),
          readFile(sourcePath),
        ]);
        if (!generated.equals(source)) {
          reject(`Generated runtime script is stale: scripts/${name}`);
        }
      } catch (error) {
        reject(`Cannot compare runtime script ${name}: ${error.message}`);
      }
    }),
  );

  const schemaPath = path.join(
    distRoot,
    "references",
    "evidence-report.schema.json",
  );
  const schemaText = await readRequiredText(schemaPath);
  if (schemaText !== null) {
    try {
      const schema = JSON.parse(schemaText);
      if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") {
        reject("Evidence schema must declare JSON Schema Draft 2020-12.");
      }
      if (
        !Array.isArray(schema.required) ||
        ![
          "profile",
          "overall_status",
          "acceptance_checks",
        ].every((key) => schema.required.includes(key))
      ) {
        reject(
          "Evidence schema must require profile, overall_status, and acceptance_checks.",
        );
      }
      if (!schema.$defs?.acceptanceCheck) {
        reject("Evidence schema must define acceptanceCheck.");
      }
      if (
        !Array.isArray(schema.$defs?.renderGate?.required) ||
        !schema.$defs.renderGate.required.includes("count_match")
      ) {
        reject("Evidence schema renderGate must require count_match.");
      }
    } catch (error) {
      reject(`Evidence schema is invalid JSON: ${error.message}`);
    }
  }
}

async function validateCatalogDocument(catalog) {
  const catalogFile = path.join(distRoot, "CATALOG.md");
  const text = await readRequiredText(catalogFile);
  if (text === null) return;

  const totalMatches = [
    ...text.matchAll(/\*\*(\d+) active Office skills\*\*/g),
  ];
  if (
    totalMatches.length !== 1 ||
    Number(totalMatches[0]?.[1]) !== catalog.skills.length
  ) {
    reject(
      `CATALOG.md must report exactly ${catalog.skills.length} active Office skills.`,
    );
  }

  const expectedLinks = new Map(
    catalog.skills.map((skill) => [
      skill.name,
      `agent-skills/${skill.category}/${skill.name}/SKILL.md`,
    ]),
  );
  const seenLinks = new Map();
  const seenHeadings = new Map();
  let currentCategory = null;

  for (const line of text.split(/\r?\n/)) {
    const heading = /^## ([A-Za-z0-9-]+) \((\d+)\)$/.exec(line);
    if (heading) {
      const category =
        heading[1][0].toLowerCase() + heading[1].slice(1);
      currentCategory = category;
      if (seenHeadings.has(category)) {
        reject(`CATALOG.md repeats category heading: ${category}`);
      }
      seenHeadings.set(category, Number(heading[2]));
      continue;
    }

    const link = /^- \[`([^`]+)`]\(([^)]+)\):/.exec(line);
    if (!link) continue;
    const [, name, target] = link;
    if (!currentCategory) {
      reject(`CATALOG.md lists ${name} before a category heading.`);
    }
    if (seenLinks.has(name)) {
      reject(`CATALOG.md repeats skill link: ${name}`);
    } else {
      seenLinks.set(name, { category: currentCategory, target });
    }
  }

  compareSets(
    new Set(seenHeadings.keys()),
    new Set(catalog.categoryOrder),
    "CATALOG.md category headings",
  );
  for (const category of catalog.categoryOrder) {
    const expectedCount = catalog.skills.filter(
      (skill) => skill.category === category,
    ).length;
    if (seenHeadings.get(category) !== expectedCount) {
      reject(
        `CATALOG.md ${category} count must be ${expectedCount}; found ${JSON.stringify(seenHeadings.get(category))}.`,
      );
    }
    const linkedCount = [...seenLinks.values()].filter(
      (item) => item.category === category,
    ).length;
    if (linkedCount !== expectedCount) {
      reject(
        `CATALOG.md ${category} section must link ${expectedCount} skills; found ${linkedCount}.`,
      );
    }
  }

  compareSets(
    new Set(seenLinks.keys()),
    new Set(expectedLinks.keys()),
    "CATALOG.md skill links",
  );
  for (const [name, expectedTarget] of expectedLinks) {
    const actual = seenLinks.get(name);
    if (!actual) continue;
    if (actual.target !== expectedTarget) {
      reject(
        `CATALOG.md link for ${name} must be ${expectedTarget}; found ${actual.target}.`,
      );
    }
    if ((await pathType(path.join(distRoot, actual.target))) !== "file") {
      reject(`CATALOG.md link target is missing: ${actual.target}`);
    }
  }
}

async function allFiles(directory) {
  const files = [];
  const items = await readdir(directory, { withFileTypes: true });
  for (const item of items.sort((left, right) =>
    left.name.localeCompare(right.name, "en"),
  )) {
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      files.push(...(await allFiles(itemPath)));
    } else if (item.isFile()) {
      files.push(itemPath);
    }
  }
  return files;
}

async function validateMarkdownFileLinks(filePath, boundary) {
  const text = await readRequiredText(filePath);
  if (text === null) return;

  for (const rawTarget of markdownTargets(text)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget) || rawTarget.startsWith("#")) {
      continue;
    }
    const withoutFragment = rawTarget.split(/[?#]/, 1)[0];
    let decoded;
    try {
      decoded = decodeURIComponent(withoutFragment).replaceAll("/", path.sep);
    } catch {
      reject(`${relative(filePath)} has an invalid encoded link: ${rawTarget}`);
      continue;
    }
    const resolved = path.resolve(path.dirname(filePath), decoded);
    if (!isInside(resolved, boundary)) {
      reject(`${relative(filePath)} has a link outside its package: ${rawTarget}`);
      continue;
    }
    const targetType = await pathType(resolved);
    if (targetType !== "file" && targetType !== "directory") {
      reject(`${relative(filePath)} links to a missing path: ${rawTarget}`);
    }
  }
}

async function validateDocumentationLinks() {
  let distributionFiles;
  try {
    distributionFiles = await allFiles(distRoot);
  } catch (error) {
    reject(`Cannot enumerate distribution documentation: ${error.message}`);
    return;
  }

  const sourceReferenceRoot = path.join(root, "references");
  let sourceReferenceFiles = [];
  try {
    sourceReferenceFiles = await allFiles(sourceReferenceRoot);
  } catch (error) {
    reject(`Cannot enumerate source references: ${error.message}`);
  }

  const sourceDocs = [
    path.join(root, "README.md"),
    path.join(root, "AGENTS.md"),
    path.join(root, "CLAUDE.md"),
    path.join(root, "DESIGN.md"),
    ...sourceReferenceFiles,
  ];
  await Promise.all([
    ...distributionFiles
      .filter((filePath) => filePath.endsWith(".md"))
      .map((filePath) => validateMarkdownFileLinks(filePath, distRoot)),
    ...sourceDocs
      .filter((filePath) => filePath.endsWith(".md"))
      .map((filePath) => validateMarkdownFileLinks(filePath, root)),
  ]);
}

async function validateNoPersonalPaths() {
  const patterns = [
    /(?:^|[\s("'`=])(?:[A-Za-z]:[\\/](?![\\/]))/m,
    /(?:^|[\s("'`=])\/(?:Users|home)\/[^/\s"'`<>]+/m,
    /(?:^|[\s("'`=])~[\\/]/m,
    /(?:^|[\s("'`=])\\\\[^\\/\s"'`<>]+[\\/][^\\/\s"'`<>]+/m,
  ];

  let files;
  try {
    files = await allFiles(distRoot);
  } catch (error) {
    reject(`Cannot scan distribution paths: ${error.message}`);
    return;
  }

  for (const filePath of files) {
    let buffer;
    try {
      buffer = await readFile(filePath);
    } catch (error) {
      reject(`Cannot read ${relative(filePath)}: ${error.message}`);
      continue;
    }
    if (buffer.includes(0)) continue;
    const text = buffer.toString("utf8");
    if (patterns.some((pattern) => pattern.test(text))) {
      reject(`${relative(filePath)} contains an absolute personal path.`);
    }
  }
}

function finishRejected() {
  console.error("REJECT");
  for (const message of [...new Set(errors)].sort()) {
    console.error(`- ${message}`);
  }
  process.exitCode = 1;
}

async function main() {
  const args = process.argv.slice(2);
  const allowMissingDist = args.includes("--allow-missing-dist");
  const unknownArgs = args.filter((arg) => arg !== "--allow-missing-dist");
  if (unknownArgs.length > 0) {
    reject(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  }
  if (args.filter((arg) => arg === "--allow-missing-dist").length > 1) {
    reject("--allow-missing-dist may be supplied only once.");
  }

  const [catalogModule, sourceMapModule] = await Promise.all([
    importRequiredModule(catalogPath, "Skill catalog"),
    importRequiredModule(sourceMapPath, "Office source map"),
  ]);
  const catalog = validateCatalog(catalogModule);
  await validateSourceMap(sourceMapModule, catalog);

  if (errors.length > 0) {
    finishRejected();
    return;
  }

  const distributionType = await pathType(distRoot);
  if (distributionType === "missing") {
    if (allowMissingDist) {
      console.log(
        "INCOMPLETE: dist/office-skills is absent; generate it before release validation.",
      );
      process.exitCode = 2;
    } else {
      reject(
        "dist/office-skills is missing. Use --allow-missing-dist only for an intentional pre-build check.",
      );
      finishRejected();
    }
    return;
  }
  if (distributionType !== "directory") {
    reject("dist/office-skills must be a directory.");
    finishRejected();
    return;
  }

  const referencesRoot = await validateRequiredReferences();
  await Promise.all([
    validateSkillFiles(catalog, referencesRoot),
    validateCatalogDocument(catalog),
    validateNoPersonalPaths(),
    validateRuntimeFiles(),
    validateDocumentationLinks(),
  ]);

  if (errors.length > 0) {
    finishRejected();
    return;
  }

  console.log(
    `PASS: validated ${catalog.skills.length} generated Office skills and ${expectedSourceCount} source mappings.`,
  );
}

try {
  await main();
} catch (error) {
  reject(`Unexpected validator failure: ${error.message}`);
  finishRejected();
}
