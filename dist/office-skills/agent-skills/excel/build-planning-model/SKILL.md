---
name: "build-planning-model"
description: "Build an Excel capacity, staffing, demand, delivery, resource, or scenario planning model. Use when operational inputs and constraints must produce a schedule, allocation, or recommendation."
---

# Build an Excel planning model

## Outcome

Produce a transparent model that exposes assumptions, constraints, scenarios, outputs, and capacity or feasibility checks.

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

1. Require the planning horizon, grain, source demand, resources, constraints, scenarios, outputs, and tolerances; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.
2. Record each observed input and controllable assumption with definition, unit, period, owner, as-of date, and exact source location.
3. Separate controllable assumptions from observed inputs.
4. Build capacity, demand, allocation, and exception calculations in auditable stages.
5. Drive every scenario from explicit selectors and propagate it through capacity, demand, allocation, exceptions, summaries, and recommendations.
6. Show bottlenecks, unmet demand, and constraint violations explicitly.
7. Test boundary fixtures and add independent conservation and capacity checks that do not reuse the allocation formulas, with explicit absolute and relative tolerances.
8. Run manage-office-sources and audit-office-claims, then verify-excel-workbook on the recalculated final XLSX.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- Allocations do not exceed available capacity unless visibly flagged.
- Demand, capacity, assigned, and unmet totals reconcile within the stated tolerance.
- Changing one scenario selector updates every declared dependent output and leaves locked actuals unchanged.
- Independent checks use a separate formula path or test fixture and expose every residual.
- A labeled skeleton, unresolved provenance, or failed workbook verifier blocks delivery.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
