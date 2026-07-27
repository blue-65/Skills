---
name: "preserve-template-fidelity"
description: "Preserve the structure and visual system of an existing Word, PowerPoint, or Excel template. Use when a supplied Office file controls layout, styles, masters, formulas, branding, or review conventions."
---

# Preserve Office template fidelity

## Outcome

Create or edit content inside the source template while retaining its native hierarchy, editability, and behavior.

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

1. Treat the supplied template as the visual and structural authority.
2. Map reusable Word styles, PowerPoint masters and layouts, or Excel sheet conventions before editing.
3. Duplicate and edit inherited structures instead of rebuilding them from scratch.
4. Apply the smallest local override that satisfies the request.
5. Record every intentional deviation from the template.
6. Render representative inherited and modified regions before reviewing the entire artifact.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Word styles remain semantic rather than direct-formatting copies.
- PowerPoint master and layout inheritance is not flattened.
- Excel formulas, tables, names, formats, and conditional formatting remain consistent.
- Unrequested global restyling is absent.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
