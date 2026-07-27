---
name: "build-financial-model"
description: "Build or extend a financial model in Excel. Use for three-statement models, valuation, unit economics, investment cases, financing, returns, or scenario analysis."
---

# Build a financial model

## Outcome

Produce an auditable model with clear inputs, calculations, outputs, checks, scenarios, and source-backed assumptions.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the excel production reference](../../../references/excel-production.md) for format-specific requirements.
- Read [financial model patterns](../../../references/financial-model-patterns.md).
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Require source actuals, accounting and metric definitions, horizon, scenarios, required outputs, and tolerances; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.
2. Record every source and assumption with definition, unit, period, as-of date, owner, and exact file, sheet, range, or external location.
3. Separate inputs, calculations, outputs, and checks into clear zones or sheets.
4. Build operating drivers before valuation; for SaaS models, create a metric dictionary and explicit ARR and logo bridges from beginning through new, expansion, contraction, churn, other adjustments, and ending.
5. Build linked income statement, balance sheet, and cash flow with opening-to-closing roll-forwards for cash, working capital, fixed assets, debt, and equity.
6. Propagate each selected scenario through all affected drivers, statements, bridges, valuation, and outputs without scenario-specific hardcoded results.
7. Add independent accounting identities and source-to-output recomputations that do not reuse the model's output formulas, with explicit absolute and relative tolerances and rounding rules.
8. Run manage-office-sources and audit-office-claims, then verify-excel-workbook on the recalculated final XLSX.
9. Validate the evidence with validate_evidence_report.py --profile financial-model before assigning PASS.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- Calculation areas contain no unexplained hardcodes.
- The three statements link and roll forward, the balance sheet balances, and ending cash reconciles within the stated tolerance.
- SaaS metric definitions are unambiguous and ARR and logo bridges close when applicable.
- Changing one scenario selector propagates to every declared dependent output while locked actuals remain unchanged.
- Valuation and return outputs trace to sourced assumptions.
- Independent checks use a different calculation path and disclose residuals rather than masking them with rounding.
- Circular logic is intentional and converges.
- A labeled skeleton, unresolved provenance, or failed workbook verifier blocks delivery.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
