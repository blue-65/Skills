# Financial model patterns

Use this reference for SaaS operating models, budgets, forecasts, and integrated
three-statement workbooks. The user request, supplied workbook, accounting
basis, and approved source data take precedence. The
[Excel production reference](excel-production.md) and
[Office output contract](office-output-contract.md) remain the delivery floor.

This is a model-construction contract, not accounting, audit, tax, or investment
advice. Treat the applicable accounting basis and policy elections as required
inputs. If a conclusion depends on a current law, regulation, accounting
standard, regulator interpretation, or tax rule, verify the current official
source live and record it in the source ledger. Without that check, mark the
conclusion `unverified` and the affected verification gate `INCONCLUSIVE`.

## Preflight contract

Do not build formulas until the working notes define:

- model purpose, decision, users, and update cadence;
- historical cutoff, forecast horizon, period grain, and fiscal calendar;
- reporting currency, model units, foreign-exchange policy, and sign convention;
- accounting basis, revenue-recognition policy, capitalization policy, and tax
  treatment supplied or approved by the responsible finance owner;
- source systems, source owners, retrieval timestamps, and baseline hashes;
- definition and cohort policy for every SaaS metric;
- scenario names, approved drivers, and selection method;
- absolute and relative tolerances for each material reconciliation;
- required outputs, valuation or financing scope, and exclusions.

If a required input is missing, expose it on an `Open Items` sheet. Do not hide
the gap in a formula or substitute an industry benchmark without an explicit,
source-backed assumption.

## Minimum workbook architecture

Keep source data, assumptions, calculations, statements, and checks visibly
separate. A compact model may combine zones on one sheet, but it must preserve
the same boundaries.

| Sheet or zone | Owns |
|---|---|
| `Read Me` | purpose, version, author, units, sign convention, source cutoff, and operating instructions |
| `Sources` | source ledger, file or URL, author or owner, as-of date, retrieval date, hash, and claim or range used |
| `Assumptions` | approved drivers, metric definitions, scenario values, and selectors |
| `Customers` | contract or customer-period ledger used for ARR, logos, retention, billings, and collections |
| `Headcount` | opening employees, hires, exits, average FTE, compensation, and cash timing |
| `Schedules` | revenue, AR, deferred revenue, fixed assets, debt, equity, tax, and other supporting schedules |
| `Statements` | income statement, balance sheet, and cash-flow statement |
| `Outputs` | decision-facing metrics, charts, valuation, and scenario comparison |
| `Checks` | independent reconciliations, residuals, tolerance, status, owner, and resolution note |

Use formulas for derived values. Hardcodes belong only in a clearly identified
input or source range, with provenance and an as-of date.

## SaaS ARR and customer bridges

### ARR bridge

Define ARR as a point-in-time operational measure and keep it separate from
recognized revenue, invoiced billings, bookings, remaining performance
obligations, and cash. State whether ARR includes usage, services, one-time
fees, contracted future starts, paused accounts, and foreign-exchange effects.

For each period, use this bridge:

```text
Ending ARR =
  Opening ARR
  + New-logo ARR
  + Expansion ARR
  + Reactivation ARR
  - Contraction ARR
  - Churned ARR
  + Defined FX or scope adjustment
```

Every movement must be mutually exclusive at the customer or contract level.
Do not classify the same movement as both expansion and new-logo ARR. Keep
defined FX or scope adjustments in a separate row rather than burying them in
retention.

Build the primary bridge from movement classifications. Build an independent
ending-ARR check by summing active customer or contract records at period end.
Do not point the check back to the bridge total.

### Logo bridge and logo churn

Define an active logo before calculating churn. Record treatment for parent and
subsidiary entities, multiple products, mergers, pauses, reactivations, free
plans, and zero-ARR customers.

```text
Ending active logos =
  Opening active logos
  + New logos
  + Reactivated logos
  - Churned logos

Gross logo churn rate =
  Logos from the opening cohort that fully churned during the period
  / Opening active logos eligible to churn
```

Use an opening-cohort denominator. Do not divide churned logos by ending logos
or mix partial product churn with full logo churn. Show annualized churn only
when the annualization method and observation period are explicit.

The independent logo check is a distinct count of active customer identifiers
at the ending date. Counts require exact equality; rounding tolerance is zero.

### Net revenue retention

Define NRR for a fixed opening cohort. Exclude new-logo ARR generated after the
cohort start.

```text
NRR =
  (Opening cohort ARR
   + Expansion from the opening cohort
   - Contraction from the opening cohort
   - Churn from the opening cohort
   + Reactivation included by the documented policy)
  / Opening cohort ARR
```

State the cohort date, measurement period, currency policy, product scope, and
reactivation policy next to the output. Keep FX-neutral and reported-currency
views separate when both are needed. If opening cohort ARR is zero, return a
labeled `N/A`; do not coerce the result to zero.

Also calculate gross revenue retention when decision-useful:

```text
GRR =
  (Opening cohort ARR - Contraction - Churn)
  / Opening cohort ARR
```

Cap GRR only if the written metric policy requires it. Do not silently cap NRR.

### CAC and CAC payback

Define the acquisition cohort, attribution window, cost pool, and gross-margin
basis before calculating CAC. State whether the cost pool includes fully loaded
sales and marketing payroll, commissions, agencies, events, channel fees,
implementation subsidies, and allocated overhead.

```text
CAC per new logo =
  Acquisition cost assigned to the cohort
  / New paying logos in the cohort

Monthly new-logo gross profit =
  New-logo recurring revenue for the month
  x Applicable gross margin

CAC payback months =
  Acquisition cost assigned to the cohort
  / Monthly new-logo gross profit
```

For a cohort model, calculate cumulative realized gross profit by month and
identify the first month in which cumulative gross profit equals or exceeds
cohort acquisition cost. Report a formula-based shortcut separately from the
realized cohort payback. Do not mix new-logo acquisition cost with expansion
ARR unless the model explicitly presents a separate expansion-payback metric.

## Headcount schedule

Build headcount at employee or role-month grain when the source permits it.
At minimum, include department, role, location, start date, exit date, salary or
wage, payroll burden, bonus, commission, benefits, recruiter fee, equipment,
and scenario.

```text
Ending FTE = Opening FTE + Starts - Exits

Average FTE for a period =
  time-weighted active FTE during the period
```

Use start and exit dates to prorate expense and cash timing. Separate headcount
from compensation: one person can have mid-period compensation changes, leave,
capitalized time, or variable commission. Reconcile the schedule independently
to HR roster snapshots and payroll totals. Treat unidentified contractors
according to the approved policy rather than silently counting or excluding
them.

## Billings, accounts receivable, and deferred revenue

Use contract, invoice, collection, credit, refund, and revenue schedules rather
than applying one growth rate to all working-capital balances.

```text
Ending gross AR =
  Opening gross AR
  + Invoices issued
  - Cash applied
  - Credits and write-offs
  + Other explicitly defined adjustments

Ending deferred revenue =
  Opening deferred revenue
  + Invoiced or collected consideration allocated to future performance
  - Revenue recognized from the deferred balance
  - Refunds or contract modifications charged to the balance
  + Other explicitly defined adjustments
```

Keep gross AR, allowance, net AR, unbilled receivables, deferred revenue, and
remaining contractual amounts distinct. Billing frequency and collection timing
must drive cash, while the approved revenue schedule drives recognized revenue.
Reconcile invoice and cash movements to the customer ledger and the balance
sheet using a path independent of the statement links.

## Three-statement integration

Build operating drivers and supporting schedules before the statements. Link
the income statement, balance sheet, and cash-flow statement; never use plug
values to force balance except a clearly defined and approved financing or cash
sweep mechanism.

Required links include:

- net income from the income statement into retained earnings and operating
  cash flow;
- non-cash expenses and working-capital changes into operating cash flow;
- capital expenditure, disposals, depreciation, and fixed assets across the
  schedules, statements, and cash flow;
- debt draw, repayment, interest, fees, and cash across the debt schedule and
  financing cash flow;
- equity issuance, repurchase, dividends, and retained earnings across equity
  and financing cash flow;
- ending cash from the cash-flow statement into the balance sheet.

Show at least these controls:

```text
Balance-sheet residual = Assets - Liabilities - Equity
Cash residual = Balance-sheet cash - Cash-flow ending cash
Retained-earnings residual =
  Ending retained earnings
  - (Opening retained earnings + Net income - Dividends + Defined adjustments)
```

Use one documented sign convention throughout. A sign-flipped display may use a
separate presentation row; it must not change the underlying calculation logic.

## Scenario contract

Use named scenarios such as `Base`, `Upside`, and `Downside` only after defining
the drivers that differ. Store scenario assumptions in one table and use one
validated selector or one explicit scenario dimension. Do not overwrite formulas
or copy hardcoded output blocks to create a scenario.

For every scenario, record:

- scenario ID, name, owner, approval date, and as-of date;
- changed drivers, source or rationale, and units;
- dependencies and constraints;
- comparison baseline;
- outputs affected and expected directional behavior.

Run a scenario propagation check: change one approved driver in a disposable
copy and confirm that every intended dependent output changes while unrelated
historical periods remain fixed.

## Independent checks and tolerance

An independent check must use a different source aggregation, formula path, or
recalculation method. Copying an output cell, repeating the same formula under a
different label, or comparing rounded display cells is not independent.

| Check | Primary path | Independent path |
|---|---|---|
| Ending ARR | movement bridge | active contract or customer ledger at period end |
| Ending logos | logo bridge | distinct active customer IDs at period end |
| NRR | cohort movement table | opening-cohort snapshots compared customer by customer |
| Headcount | hire and exit roll-forward | HR roster snapshot and payroll reconciliation |
| Revenue | revenue schedule | contract-level recognition aggregation |
| AR | statement link | invoice, receipt, credit, and write-off roll-forward |
| Deferred revenue | statement link | contract-liability roll-forward |
| Ending cash | cash-flow statement | opening cash plus independently summed cash movements |
| Balance sheet | statement totals | direct sum of underlying account balances |

Store `expected`, `actual`, `difference`, `absolute_tolerance`,
`relative_tolerance`, `effective_tolerance`, `status`, and `owner` for every
material check.

```text
effective tolerance =
  max(absolute tolerance,
      relative tolerance x max(abs(expected), abs(actual), 1))

PASS when abs(actual - expected) <= effective tolerance
REJECT when abs(actual - expected) > effective tolerance
```

Set tolerances in model units before calculation. Counts use zero tolerance.
External-source reconciliations may use at most half of the source's stated
rounding increment unless the finance owner approves a different threshold.
When the source precision or approved tolerance is unknown, the check is
`INCONCLUSIVE`; do not invent a materiality threshold. Never hide a difference
by rounding the check row.

## Sources, claims, and assumptions

For every material input, record source ID, owner or author, title or system,
source path or canonical URL, source date, retrieval timestamp, applicable
range, units, transformation, and SHA-256 hash when the source is a file.

Use these content labels consistently:

- `verified`: traced to an approved source or independently reproduced;
- `assumption`: deliberately selected input with owner and rationale;
- `unverified`: plausible but not yet supported by sufficient evidence.

These content labels do not replace delivery-gate statuses. Final gate statuses
are only `PASS`, `REJECT`, and `INCONCLUSIVE`.

## Final verification

Recalculate in the target Excel application, save, reopen the exact final path,
rerun every check, scan formula and link integrity, and render every used sheet
or intended print area. Record the workbook path and SHA-256 hash, reopen
evidence, scan result, render inventory, runtime checks, accessibility result,
and unresolved items using
[the verification evidence contract](verification-evidence.md) and
`evidence-report.schema.json`.

Before delivery, run the semantic evidence validator with
`--profile financial-model`. Its required acceptance checks must include the
exact model target, sourced inputs, and independent calculations with explicit
tolerances, plus cross-artifact reconciliation to the source ledger.

If any required independent check exceeds tolerance, mark the model `REJECT`.
If the target application, source precision, accounting basis, or required
check is unavailable, mark it `INCONCLUSIVE`. Only a fully evidenced final
artifact may be marked `PASS`.
