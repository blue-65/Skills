#!/usr/bin/env node

import {
  copyFile,
  lstat,
  mkdir,
  readFile,
  realpath,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { entries, sourceCommit } from "../office-adaptation/source-map.mjs";
import { categoryOrder, skills } from "./skill-catalog.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const distRoot = path.join(root, "dist");
const outputRoot = path.join(distRoot, "office-skills");
const temporaryRoot = path.join(distRoot, ".office-skills-build");
const transientRenameCodes = new Set([
  "EACCES",
  "EBUSY",
  "ENOTEMPTY",
  "EPERM",
]);

const categoryReference = {
  word: "word-production.md",
  powerpoint: "powerpoint-production.md",
  excel: "excel-production.md",
};

const categoryFloor = {
  common: [
    "Preserve the source artifact unless the user explicitly authorizes replacement.",
    "Keep claims, calculations, assumptions, and recommendations distinguishable.",
    "Use native, editable Office structures whenever the final user needs to continue editing.",
  ],
  word: [
    "Use real Word styles, fields, numbering, captions, sections, and table geometry.",
    "Update fields and the table of contents before saving the final DOCX.",
    "Render and inspect every page; structural extraction is not visual verification.",
  ],
  powerpoint: [
    "Give every slide one narrative job and one primary claim.",
    "Preserve masters, layouts, placeholders, notes, and native editability.",
    "Render every slide and run the slide show for motion, media, links, or triggers.",
  ],
  excel: [
    "Store typed values and make derived outputs formula-driven and auditable.",
    "Recalculate in the target application and trace representative outputs to inputs.",
    "Render every used sheet or intended print area after scanning formula errors.",
  ],
};

const skillReferenceMap = {
  "audit-office-accessibility": ["verification-evidence.md"],
  "compare-office-versions": ["verification-evidence.md"],
  "prepare-client-delivery": ["verification-evidence.md"],
  "build-financial-model": ["financial-model-patterns.md"],
  "build-planning-model": ["financial-model-patterns.md"],
  "reconcile-workbook-values": [
    "financial-model-patterns.md",
    "verification-evidence.md",
  ],
  "create-rfp-response": ["rfp-response-patterns.md"],
  "build-rfp-compliance-matrix": ["rfp-response-patterns.md"],
  "build-long-word-document": ["rfp-response-patterns.md"],
  "manage-word-comments-redlines": [
    "rfp-response-patterns.md",
    "verification-evidence.md",
  ],
  "create-pitch-deck": ["proposal-deck-patterns.md"],
  "create-proposal-deck": ["proposal-deck-patterns.md"],
  "plan-presentation-story": ["proposal-deck-patterns.md"],
  "control-office-with-com": ["execution-runtime.md"],
  "verify-office-deliverable": [
    "execution-runtime.md",
    "verification-evidence.md",
  ],
  "verify-powerpoint": ["execution-runtime.md", "verification-evidence.md"],
  "verify-excel-workbook": [
    "execution-runtime.md",
    "verification-evidence.md",
  ],
};

const verificationSkills = new Set([
  "verify-office-deliverable",
  "verify-powerpoint",
  "verify-excel-workbook",
]);

function yamlString(value) {
  return JSON.stringify(value);
}

async function renameWithRetry(source, target) {
  const maximumAttempts = 8;
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      await rename(source, target);
      return;
    } catch (error) {
      if (
        !transientRenameCodes.has(error?.code) ||
        attempt === maximumAttempts
      ) {
        throw error;
      }
      await delay(50 * 2 ** (attempt - 1));
    }
  }
}

function commonSkillLink(skill, name) {
  return skill.category === "common"
    ? `../${name}/SKILL.md`
    : `../../common/${name}/SKILL.md`;
}

function companionWorkflows(skill) {
  const lines = [];
  if (
    skill.name !== "manage-office-sources" &&
    skill.name !== "audit-office-claims"
  ) {
    lines.push(
      `- For external claims, metrics, or assets, use [manage-office-sources](${commonSkillLink(skill, "manage-office-sources")}) and [audit-office-claims](${commonSkillLink(skill, "audit-office-claims")}); unresolved evidence remains \`unverified\`.`,
    );
  }

  if (skill.category === "powerpoint" && skill.name !== "verify-powerpoint") {
    lines.push(
      "- Before delivery, run [verify-powerpoint](../verify-powerpoint/SKILL.md).",
    );
  } else if (
    skill.category === "excel" &&
    skill.name !== "verify-excel-workbook"
  ) {
    lines.push(
      "- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).",
    );
  } else if (
    skill.category === "word" &&
    !verificationSkills.has(skill.name)
  ) {
    lines.push(
      `- Before delivery, run [verify-office-deliverable](${commonSkillLink(skill, "verify-office-deliverable")}) with the Word production checks.`,
    );
  }

  if (skill.name === "create-rfp-response") {
    lines.push(
      "- Build the requirements ledger with [build-rfp-compliance-matrix](../../excel/build-rfp-compliance-matrix/SKILL.md) and create a separate review copy with [manage-word-comments-redlines](../manage-word-comments-redlines/SKILL.md) when redline delivery is requested.",
    );
  }

  return lines.length > 0
    ? `\n## Required companion workflows\n\n${lines.join("\n")}\n`
    : "";
}

function additionalReferences(skill) {
  const names = skillReferenceMap[skill.name] ?? [];
  if (names.length === 0) {
    return "";
  }
  return names
    .map(
      (name) =>
        `- Read [${name.replace(/\.md$/, "").replaceAll("-", " ")}](../../../references/${name}).`,
    )
    .join("\n")
    .concat("\n");
}

function skillMarkdown(skill) {
  const reference = categoryReference[skill.category];
  const floor = categoryFloor[skill.category];
  const workflow = skill.steps
    .map((step, index) => `${index + 1}. ${step}`)
    .join("\n");
  const checks = [...floor, ...skill.checks]
    .map((check) => `- ${check}`)
    .join("\n");
  const formatReference = reference
    ? `- Read [the ${skill.category} production reference](../../../references/${reference}) for format-specific requirements.\n`
    : "";

  return `---
name: ${yamlString(skill.name)}
description: ${yamlString(skill.description)}
---

# ${skill.title}

## Outcome

${skill.outcome}

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
${formatReference}${additionalReferences(skill)}- If the target project has its own \`DESIGN.md\` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains \`agent-skills\`, \`references\`, and \`scripts\`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as \`INCONCLUSIVE\`.

## Workflow

${workflow}
${companionWorkflows(skill)}

## Verification

${checks}

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as \`INCONCLUSIVE\`, not \`PASS\`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
`;
}

function openaiYaml(skill) {
  const taskSentence = skill.description.split(" Use ")[0].replace(/\.$/, "");
  return `interface:
  display_name: ${yamlString(skill.title)}
  short_description: ${yamlString(skill.short)}
  default_prompt: ${yamlString(`Use $${skill.name}. ${taskSentence}. Follow its failure boundaries and return the required evidence.`)}
`;
}

function validateCatalog() {
  const names = new Set();
  for (const skill of skills) {
    if (!categoryOrder.includes(skill.category)) {
      throw new Error(`Unknown category: ${skill.category}`);
    }
    if (
      skill.name.length > 64 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.name)
    ) {
      throw new Error(`Invalid skill name: ${skill.name}`);
    }
    if (names.has(skill.name)) {
      throw new Error(`Duplicate skill name: ${skill.name}`);
    }
    if (
      typeof skill.description !== "string" ||
      skill.description.length === 0 ||
      skill.description.length > 1024 ||
      !skill.description.includes("Use ")
    ) {
      throw new Error(`Invalid skill description: ${skill.name}`);
    }
    if (skill.short.length < 25 || skill.short.length > 64) {
      throw new Error(
        `Short description must be 25-64 characters: ${skill.name}`,
      );
    }
    if (!Array.isArray(skill.steps) || skill.steps.length < 3) {
      throw new Error(`Skill needs at least three workflow steps: ${skill.name}`);
    }
    if (!Array.isArray(skill.checks) || skill.checks.length < 2) {
      throw new Error(`Skill needs at least two checks: ${skill.name}`);
    }
    names.add(skill.name);
  }

  const mappedTargets = new Set(entries.flatMap((entry) => entry.targetSkills));
  for (const target of mappedTargets) {
    if (!names.has(target)) {
      throw new Error(`Source map references an unknown target skill: ${target}`);
    }
  }
}

async function assertSafeBuildPath(target) {
  const expectedParent = `${path.resolve(distRoot)}${path.sep}`;
  const resolved = path.resolve(target);
  if (!resolved.startsWith(expectedParent)) {
    throw new Error(`Refusing to replace unsafe build path: ${resolved}`);
  }

  const rootReal = await realpath(root);
  const expectedDistReal = path.join(rootReal, "dist");
  try {
    const distStats = await lstat(distRoot);
    if (distStats.isSymbolicLink()) {
      throw new Error(`Refusing to use linked dist directory: ${distRoot}`);
    }
    const distReal = await realpath(distRoot);
    if (path.resolve(distReal) !== path.resolve(expectedDistReal)) {
      throw new Error(`Refusing to use redirected dist directory: ${distReal}`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  try {
    const targetStats = await lstat(target);
    if (targetStats.isSymbolicLink()) {
      throw new Error(`Refusing to replace linked build path: ${resolved}`);
    }
    const targetReal = await realpath(target);
    const safeRealParent = `${path.resolve(expectedDistReal)}${path.sep}`;
    if (!path.resolve(targetReal).startsWith(safeRealParent)) {
      throw new Error(`Refusing to replace redirected build path: ${targetReal}`);
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function generateSkills(targetRoot) {
  for (const skill of skills) {
    const skillDir = path.join(
      targetRoot,
      "agent-skills",
      skill.category,
      skill.name,
    );
    await mkdir(path.join(skillDir, "agents"), { recursive: true });
    await writeFile(
      path.join(skillDir, "SKILL.md"),
      skillMarkdown(skill),
      "utf8",
    );
    await writeFile(
      path.join(skillDir, "agents", "openai.yaml"),
      openaiYaml(skill),
      "utf8",
    );
  }
}

async function generateCatalog(targetRoot) {
  const lines = [
    "# Office skill catalog",
    "",
    `This distribution contains **${skills.length} active Office skills** generated from \`scripts/skill-catalog.mjs\`.`,
    "",
  ];

  for (const category of categoryOrder) {
    const inCategory = skills.filter((skill) => skill.category === category);
    lines.push(
      `## ${category[0].toUpperCase()}${category.slice(1)} (${inCategory.length})`,
      "",
    );
    for (const skill of inCategory) {
      lines.push(
        `- [\`${skill.name}\`](agent-skills/${category}/${skill.name}/SKILL.md): ${skill.description}`,
      );
    }
    lines.push("");
  }

  await writeFile(
    path.join(targetRoot, "CATALOG.md"),
    lines.join("\n"),
    "utf8",
  );
}

async function copyReferences(targetRoot) {
  const referenceNames = [
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
  const targetReferences = path.join(targetRoot, "references");
  await mkdir(targetReferences, { recursive: true });
  for (const name of referenceNames) {
    await copyFile(
      path.join(root, "references", name),
      path.join(targetReferences, name),
    );
  }
}

async function copyRuntimeScripts(targetRoot) {
  const scriptNames = [
    "scan_office.py",
    "office_preflight.ps1",
    "export_office.ps1",
    "requirements-validation.txt",
    "validate_evidence_report.py",
    "validate_ooxml.py",
  ];
  const targetScripts = path.join(targetRoot, "scripts");
  await mkdir(targetScripts, { recursive: true });
  for (const name of scriptNames) {
    await copyFile(
      path.join(root, "scripts", name),
      path.join(targetScripts, name),
    );
  }
}

async function generateProvenance(targetRoot) {
  const sourceMap = {
    upstream: "https://github.com/MengTo/Skills",
    sourceCommit,
    sourceSkillCount: entries.length,
    generatedSkillCount: skills.length,
    entries,
  };
  await writeFile(
    path.join(targetRoot, "SOURCE_MAP.json"),
    `${JSON.stringify(sourceMap, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(targetRoot, "UPSTREAM.md"),
    `# Upstream provenance

This Office-native distribution is derived from
[MengTo/Skills](https://github.com/MengTo/Skills) at commit
\`${sourceCommit}\`.

The original \`agent-skills\`, demos, screenshots, and provenance files remain
unchanged in the fork. \`SOURCE_MAP.json\` accounts for every upstream skill and
records how it informed this distribution. The generated distribution does not
copy upstream demos, screenshots, remote assets, or vendored web runtimes.

The upstream MIT license is included as \`LICENSE\`.
`,
    "utf8",
  );
}

async function generateReadme(targetRoot) {
  const counts = Object.fromEntries(
    categoryOrder.map((category) => [
      category,
      skills.filter((skill) => skill.category === category).length,
    ]),
  );
  await writeFile(
    path.join(targetRoot, "README.md"),
    `# Office Skills

A deterministic, Office-workflow Agent Skills distribution for Microsoft Word,
PowerPoint, and Excel. It preserves MengTo/Skills as an upstream reference while
replacing web-runtime assumptions with editable Office contracts, source
protection, application readback, accessibility checks, and render-based gates.

## Library

- Common workflows: ${counts.common}
- Word workflows: ${counts.word}
- PowerPoint workflows: ${counts.powerpoint}
- Excel workflows: ${counts.excel}
- Total active skills: ${skills.length}

Start with [route-office-task](agent-skills/common/route-office-task/SKILL.md)
when the correct output format is unclear. Read [CATALOG.md](CATALOG.md) for the
complete list.

## Installation

Install the complete distribution root. If a compatible Agent Skills loader
copies only selected folders under \`agent-skills\`, it must also preserve
\`references\`, \`scripts\`, \`DESIGN.md\`, and their relative paths. Resolve
runtime commands from that installed distribution root, never from an assumed
caller working directory.

## Runtime boundary

The skills do not replace a Word, PowerPoint, or Excel content-authoring engine.
Use a host artifact runtime or Windows desktop Office. The included
\`scripts/office_preflight.ps1\`, \`scripts/export_office.ps1\`,
\`scripts/scan_office.py\`, and \`scripts/validate_evidence_report.py\` provide
capability detection, application-backed export, deterministic static scanning,
and profile-aware evidence validation. They do not prove visual quality,
calculation, animation, or form behavior without the actual Office application.
Install the pinned Draft 2020-12 validator with
\`python -m pip install -r scripts/requirements-validation.txt\`; if it is
unavailable, evidence validation returns \`INCONCLUSIVE\`, never \`PASS\`.

## Production contract

Every create or edit workflow must preserve the source, save and reopen the
final artifact, run a format-specific issue scan, render every page, slide, or
used worksheet, and inspect the render. A skipped required gate is
\`INCONCLUSIVE\`, not \`PASS\`.

## Provenance

See [UPSTREAM.md](UPSTREAM.md) and [SOURCE_MAP.json](SOURCE_MAP.json). The
upstream MIT license is retained in [LICENSE](LICENSE).
`,
    "utf8",
  );
}

async function build() {
  validateCatalog();
  await assertSafeBuildPath(outputRoot);
  await assertSafeBuildPath(temporaryRoot);

  await mkdir(distRoot, { recursive: true });
  await assertSafeBuildPath(outputRoot);
  await assertSafeBuildPath(temporaryRoot);
  await rm(temporaryRoot, {
    recursive: true,
    force: true,
    maxRetries: 8,
    retryDelay: 100,
  });
  await mkdir(temporaryRoot, { recursive: true });

  await Promise.all([
    generateSkills(temporaryRoot),
    generateCatalog(temporaryRoot),
    copyReferences(temporaryRoot),
    copyRuntimeScripts(temporaryRoot),
    generateProvenance(temporaryRoot),
    generateReadme(temporaryRoot),
    copyFile(path.join(root, "DESIGN.md"), path.join(temporaryRoot, "DESIGN.md")),
    copyFile(path.join(root, "LICENSE"), path.join(temporaryRoot, "LICENSE")),
  ]);

  const readme = await readFile(path.join(temporaryRoot, "README.md"), "utf8");
  if (!readme.includes(`Total active skills: ${skills.length}`)) {
    throw new Error("Generated README count is inconsistent.");
  }

  await rm(outputRoot, {
    recursive: true,
    force: true,
    maxRetries: 8,
    retryDelay: 100,
  });
  await renameWithRetry(temporaryRoot, outputRoot);
  console.log(
    `Generated ${skills.length} Office skills from ${entries.length} mapped upstream skills.`,
  );
}

await build();
