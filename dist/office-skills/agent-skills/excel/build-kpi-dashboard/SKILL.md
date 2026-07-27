---
name: "build-kpi-dashboard"
description: "Build an Excel KPI, management, operational, or performance dashboard. Use when leaders need a compact view of defined metrics, targets, trends, exceptions, and drill-down data."
---

# Build an Excel KPI dashboard

## Outcome

Produce a formula-driven dashboard with traceable KPI definitions, visible source data, restrained charts, and reliable print or screen layout.

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

1. Define audience, decision cadence, KPI owner, formula, target, unit, and as-of date.
2. Keep source data and calculations separate from the dashboard sheet.
3. Use a small set of charts matched to trend, comparison, variance, or exception.
4. Pair status color with labels or symbols.
5. Show target, actual, variance, and trend only when they aid action.
6. Recalculate and render the dashboard at its intended viewing size.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- Every KPI is formula-driven and defined.
- Charts have meaningful titles and series names.
- The dashboard is the active and readable starting sheet.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
