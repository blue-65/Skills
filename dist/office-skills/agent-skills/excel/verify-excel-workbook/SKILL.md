---
name: "verify-excel-workbook"
description: "Verify a final Excel workbook for formulas, values, data types, structure, charts, print layout, accessibility, and save integrity. Use after creating or editing an XLSX and before delivery."
---

# Verify an Excel workbook

## Outcome

Confirm the exact saved workbook recalculates correctly, contains no obvious errors, and is readable and usable in Excel.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the excel production reference](../../../references/excel-production.md) for format-specific requirements.
- Read [execution runtime](../../../references/execution-runtime.md).
- Read [verification evidence](../../../references/verification-evidence.md).
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Require the final absolute XLSX path, acceptance brief, exact key cells or ranges, expected sheet and print targets, scenarios, and tolerances; ask for missing inputs and otherwise return INCONCLUSIVE.
2. Save and reopen the exact XLSX with automatic calculation enabled, record its SHA-256, then run a full calculation.
3. Inspect key ranges with values and formulas and trace representative outputs to inputs.
4. Recompute critical totals independently from raw inputs through a different formula or aggregation path and compare them under explicit absolute and relative tolerances.
5. Scan used ranges for formula errors, circular references, placeholders, blank sheets, and clipped values.
6. Check tables, names, validation, conditional formatting, charts, links, and print areas.
7. For applicable models, verify three-statement roll-forwards, SaaS metric definitions and ARR or logo bridges, and scenario propagation through every declared dependent output.
8. Render every used sheet or intended print area and inspect it.
9. Repair defects and repeat calculation, structural, and visual gates.
10. Write UTF-8 evidence JSON with artifact path and SHA-256, Excel and verifier versions, exact target cells or ranges, and acceptance_checks records containing method, evidence location, expected, observed, tolerance, status, met, and limitations.
11. Validate the report against evidence-report.schema.json and run validate_evidence_report.py with the matching profile before assigning PASS.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- No unexplained formula error or displayed ### remains.
- Key totals reconcile through an independent calculation path within stated tolerances.
- Every chart uses the intended source range.
- Scenario changes propagate to all declared dependents while locked actuals remain unchanged.
- Required SKIP results produce INCONCLUSIVE.
- The evidence JSON is parseable and includes every failed, skipped, or inconclusive check.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
