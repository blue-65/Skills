---
name: "apply-office-design-system"
description: "Translate a brand or project design system into Word, PowerPoint, and Excel-safe tokens. Use when creating unbranded Office files, applying DESIGN.md, or converting web-oriented visual rules into printable and editable Office output."
---

# Apply an Office design system

## Outcome

Define format-specific typography, color, spacing, grid, table, chart, and image rules before content styling begins.

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

1. Read the current project design contract and any supplied template before choosing defaults.
2. Resolve fonts to installed Office-safe families with verified Korean glyph coverage when needed.
3. Convert colors into named semantic roles and reserve saturated accents for meaningful emphasis.
4. Define Word page and paragraph tokens, PowerPoint slide and type tokens, and Excel sheet and number-format tokens.
5. Specify permitted exceptions for print, projector, accessibility, and locale constraints.
6. Apply the token set consistently and audit direct-formatting drift.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Contrast is readable in the target medium.
- Typography survives font substitution.
- The system does not rely on gradients, glass effects, or tiny labels.
- Template or project rules take precedence over repository defaults.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
