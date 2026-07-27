---
name: "inspect-office-source"
description: "Inspect Word, PowerPoint, Excel, PDF, image, and text sources before Office authoring or editing. Use when a request depends on an existing template, source document, reference deck, workbook, or mixed attachment set."
---

# Inspect an Office source

## Outcome

Produce a compact source inventory that identifies structure, reusable assets, authoritative facts, template constraints, and unresolved gaps.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. List every supplied file with format, size, modified time, and intended role.
2. Inspect Word styles and sections, PowerPoint masters and layouts, and Excel sheets, named ranges, tables, formulas, and charts.
3. Extract text and metadata without treating extraction as visual verification.
4. Identify which artifacts are authoritative, derivative, stale, or purely visual references.
5. Record reusable logos, images, charts, tables, citations, and design tokens.
6. Flag password protection, macros, external links, unsupported features, and missing dependencies.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- The inventory distinguishes content authority from visual authority.
- All templates, masters, formulas, and external links that constrain editing are named.
- No write action occurs during inspection.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
