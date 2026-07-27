---
name: "reconcile-workbook-values"
description: "Reconcile Excel values between sources, sheets, versions, systems, or reporting outputs. Use when totals differ, formula chains are uncertain, or delivery requires independent numeric verification."
---

# Reconcile workbook values

## Outcome

Identify and explain every material difference with a traceable bridge from source inputs to final outputs.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the excel production reference](../../../references/excel-production.md) for format-specific requirements.
- Read [financial model patterns](../../../references/financial-model-patterns.md).
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

1. Require the exact files, sheets, ranges, keys, totals, periods, units, and acceptance tolerances; ask for missing inputs and otherwise return INCONCLUSIVE.
2. Preserve raw source values and record each source path, SHA-256, as-of date, extraction method, and build a normalized reconciliation table.
3. Trace formula precedents and mapping rules rather than comparing only displayed totals.
4. Separate timing, scope, classification, currency, sign, and true error differences.
5. Define absolute and relative tolerance plus rounding rules per metric, and never net unrelated residuals solely to reach zero.
6. Recompute representative items and final control totals independently from raw data through a separate formula or aggregation path.
7. Write UTF-8 evidence JSON with source hashes, sheet and cell locations, formulas or methods, and acceptance_checks records containing expected and observed values, tolerances, difference classifications, status, met, and limitations.
8. Run manage-office-sources and audit-office-claims, then verify-excel-workbook on any delivered reconciliation workbook.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- The reconciliation closes to zero or an explained residual.
- Units and signs are consistent.
- Every PASS meets its declared absolute or relative tolerance using an independent calculation path.
- No difference is hidden by rounding or offset against an unrelated variance.
- The evidence JSON is parseable and every compared total resolves to exact source and output cells.
- Missing inputs, unresolved residuals, or a failed workbook verifier remain INCONCLUSIVE.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
