# Office Skills repository rules

## Scope

This fork preserves the upstream MengTo/Skills tree and generates a portable
Office distribution for Microsoft Word, PowerPoint, Excel, and cross-Office
workflows.

## Required reading

Before changing the Office distribution:

1. Read this file.
2. Read `DESIGN.md`.
3. Read `references/office-output-contract.md`.
4. Read `scripts/skill-catalog.mjs` and the relevant format reference.

## Skill contract

The canonical Office skill definitions live in `scripts/skill-catalog.mjs`.
`scripts/build-office-skills.mjs` generates each installable skill at:

```text
dist/office-skills/agent-skills/<category>/<skill-name>/
  SKILL.md
  agents/openai.yaml
```

Rules:

- Do not hand-edit generated files under `dist/office-skills`.
- Do not delete, rename, or rewrite the upstream `agent-skills` tree.
- Account for every upstream `SKILL.md` exactly once in
  `office-adaptation/source-map.mjs`.
- Use lowercase hyphen-case names no longer than 64 characters.
- The folder name and frontmatter `name` must match.
- Frontmatter contains only `name` and `description`.
- Put every trigger and "Use when" condition in `description`.
- Keep `SKILL.md` procedural and under 500 lines.
- Link directly to shared references instead of duplicating long guidance.
- Use imperative instructions.
- Keep examples fictional and free of private client information.

## Office behavior

- Preserve the source file unless replacement is explicit.
- User request and supplied template override repository defaults.
- Keep Office outputs native and editable.
- Never add macros, ActiveX, executable content, or external connections without
  explicit authorization.
- Do not claim verification from code or XML alone.
- Save integrity, structural scan, and full visual review are separate gates.
- A skipped required check is `INCONCLUSIVE`, not `PASS`.
- Word form interaction, PowerPoint animation and Morph, and Excel calculation
  require application-level testing.

## Design behavior

- Apply `DESIGN.md` only when a user, template, or project design system does not
  provide a higher-priority visual contract.
- Avoid decorative gradients, glassmorphism, repeated card grids, tiny uppercase
  labels, and full-artifact rasterization.
- Verify Korean glyph coverage when Korean content is present.

## Repository validation

Run:

```text
python -m pip install -r scripts/requirements-validation.txt
node scripts/build-office-skills.mjs
node scripts/validate-office-skills.mjs
python scripts/validate_ooxml.py --self-test
python scripts/scan_office.py --self-test
python scripts/validate_evidence_report.py --self-test
```

Parse both PowerShell runtime adapters before release. Do not commit generated
skill changes without running every applicable command.

## Git discipline

- Keep upstream attribution and the MIT license.
- Keep one focused branch and commit for one coherent change.
- Do not add personal absolute paths, credentials, private source material, or
  generated client deliverables.
