---
name: "create-business-workbook"
description: "Create a general-purpose Excel workbook for analysis, tracking, planning, or reporting. Use when structured data, formulas, filters, controls, or repeatable updates are central and no narrower Excel skill applies."
---

# Create a business workbook

## Outcome

Produce an editable XLSX with clear sheet roles, typed values, auditable formulas, readable formatting, and verified outputs.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the excel production reference](../../../references/excel-production.md) for format-specific requirements.
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Define users, update cadence, inputs, calculations, outputs, and control checks.
2. Design descriptive sheets and ranges before populating data.
3. Use typed values, explicit number formats, Excel Tables, and visible assumptions.
4. Write consistent formulas with correct absolute and relative references.
5. Add filters, freeze panes, validation, and charts only where they improve use.
6. Recalculate, inspect key ranges, scan formula errors, and render every used sheet.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- No unexplained blank sheet remains.
- Derived outputs are formulas rather than hardcoded values.
- Users can identify inputs, calculations, and outputs.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
