# Verification evidence contract

Use this reference after creating or materially editing a Word, PowerPoint, or
Excel artifact. It defines what must be recorded before delivery. The
[Office output contract](office-output-contract.md) and the format-specific
production reference define which checks are required. This reference defines
their evidence and status.

Write the machine-readable report against `evidence-report.schema.json`, JSON
Schema Draft 2020-12. The report describes the exact final artifact, not a
working copy, earlier render, or structurally similar file. Set `profile` to
`generic`, `proposal`, `rfp`, or `financial-model` and use the same value when
running semantic validation.

## Controlled terminology

Delivery-gate and report statuses are uppercase:

- `PASS`: the required check ran on the exact final artifact, produced sufficient
  evidence, and found no delivery-blocking defect.
- `REJECT`: the check ran and found a defect or contradiction that prevents
  delivery.
- `INCONCLUSIVE`: the required check did not run, did not cover the full scope,
  used the wrong artifact, lacked sufficient evidence, or could not establish a
  result.

Never use `SKIP` as a final status. A skipped required check is
`INCONCLUSIVE`. Never use `partially verified` as a gate result.

Claim and source labels are lowercase and answer a different question:

- `verified`: a claim or input is traced to current approved evidence;
- `assumption`: a deliberate input has an owner, rationale, unit, and date;
- `unverified`: evidence is missing, stale, out of scope, or insufficient.

RFP response statuses such as `COMPLIANT`, `ROADMAP`, and `EXCEPTION` describe
the bidder response. They do not prove a verification gate.

## Status aggregation

Set `overall_status` using this order:

1. If any required gate is `REJECT`, or an open unresolved item is
   delivery-blocking, overall status is `REJECT`.
2. Otherwise, if any required gate is `INCONCLUSIVE`, overall status is
   `INCONCLUSIVE`.
3. Otherwise, when every required acceptance check plus reopen, scan, render,
   required runtime, and required accessibility gates are all `PASS`, overall
   status is `PASS`.

A non-applicable runtime feature may be recorded with `required: false`,
`applicable: false`, a specific reason, and `PASS`. Do not declare a required
feature non-applicable merely because the target application is unavailable.

## Acceptance checks

Record the brief's measurable completion rules in top-level
`acceptance_checks`. Every record contains a stable ID, category, required
flag, method, expected and observed values, tolerance, status, `met` Boolean,
evidence references, and limitations.

Every report includes at least one `exact_target` check. Use the relevant
additional categories:

- `source` for claim, input, and asset provenance;
- `cross_artifact` for repeated facts across package members;
- `baseline` for version comparison and redline identity;
- `customer_evidence`, `security_evidence`, and `economic_evidence` for a
  proposal;
- `calculation` for an independently recomputed workbook result.

A counted `exact_target` also records `target_artifact_id`, `target_kind`, and
the complete set of `inventory_item_ids` that prove the count. The target
artifact is the primary deliverable. Proposal counts bind only to slide items,
RFP counts bind only to primary-DOCX page items, and financial-model counts bind
to either primary-workbook sheet items or primary-workbook print-page items.
`expected`, `observed`, the number of referenced inventory IDs, and any
`--expected-count` value must all agree.

A `PASS` report contains only `PASS` acceptance checks with `met: true`.
`REJECT` and `INCONCLUSIVE` checks use `met: false` and state at least one
limitation. A check is not evidence for itself; its `evidence` must identify a
hashed artifact and exact location.

Financial `calculation` checks additionally record `actual`, `difference`,
`absolute_tolerance`, `relative_tolerance`, `effective_tolerance`,
`difference_classification`, and `owner`. The semantic validator recomputes the
difference and effective tolerance before accepting `PASS`.

## Freeze and identify artifacts

After the last intended edit:

1. Save the artifact to its final absolute path.
2. Confirm the file exists, is non-empty, and has the expected format.
3. Record byte size, modified timestamp, format, and SHA-256 hash.
4. Assign a stable `artifact_id` and role.
5. Record the source or baseline artifact separately when comparison, template
   preservation, or redline work is in scope.
6. Record issuing organization, named author, and Office metadata author as
   separate authorship fields.

Use `role: primary` for the delivered artifact, `baseline` for the exact
comparison source, `source_ledger` for the claim ledger, `redline` for a tracked
change artifact, and `supporting` for a calculation workbook or package member.
`primary_artifact_id` must identify exactly one artifact entry with role
`primary`.

If reopening, recalculation, field updates, link refresh, or runtime testing
changes the file, save it again, calculate a new hash, and repeat every gate
whose evidence depended on the previous hash. The report must end on the last
saved hash.

## Reopen evidence

Reopen or reattach to the exact final path in the target Office application.
Record:

- application and version;
- checked timestamp and method;
- opened artifact ID and path;
- readback appropriate to the format;
- findings and evidence references.

Word readback includes sections, pages, fields, TOC, comments, and revisions.
PowerPoint readback includes slide count, masters, layouts, notes, links, media,
and hidden slides. Excel readback includes sheets, used ranges, calculation
mode, formula counts, names, tables, charts, links, and print areas.

Opening a ZIP package, parsing OOXML, or extracting text is structural
inspection, not application reopen evidence.

## Automated scan evidence

Record the exact tool, version, command, start and finish timestamps, exit code,
scope, issue count, findings, and evidence artifacts.

A scan is `PASS` only when it completes across the required scope with exit code
`0` and issue count `0`. A completed scan with material issues is `REJECT`. A
crash, unavailable tool, partial scope, unscanned package member, or unknown
exit result is `INCONCLUSIVE`.

Use stable finding IDs and exact locations such as page, slide, shape, sheet,
range, formula, relationship, or package part. Link every blocking finding to an
unresolved item until fixed.

## Render inventory and visual review

Create one render-inventory item for every required unit:

- every Word page;
- every PowerPoint slide rendered from the required static export;
- every used Excel worksheet or every page of its intended print area.

Each inventory record must contain item ID, artifact ID, kind, ordinal, source
location, render path, render SHA-256, inspected Boolean, inspector, inspection
timestamp, inspection status, dimensions when available, and findings. Artifact
ID must resolve to the artifact the physical unit came from.

Set `expected_count` from application readback and `actual_count` from the
inventory. They must match for a complete inventory. `inventory_complete` is
true only when every required unit has exactly one usable render and every
render has been individually inspected. Set `count_match` only after confirming
`expected_count`, `actual_count`, and inventory length are equal.

Item IDs and render paths are unique. Within one artifact and kind, each
ordinal and source location is unique, and ordinals form the contiguous
sequence `1..N`. Repeating one slide, page, sheet, or print page under multiple
IDs is not count evidence.

A montage helps review sequence and consistency but does not replace
full-reading-size inspection. Structural scans do not replace rendering.

## Runtime evidence

Use the actual target Office application for behavior that a static artifact
cannot prove. Record one test per required feature with expected behavior,
observed behavior, tolerance, method, application version, status, evidence,
and limitations.

Runtime scope may include:

- PowerPoint Morph, animation, transition, triggers, media, links, 3D, and
  presenter flow;
- Word content controls, protection, tab order, links, fields, and
  cross-references;
- Excel recalculation, validation, filters, PivotTables, slicers, controls,
  approved macros, queries, refreshes, links, and connections.

Do not infer runtime success from OOXML presence or a static render. If a
required feature cannot run, status is `INCONCLUSIVE`.

## Accessibility evidence

Record the checker, checker version, timestamp, scope, individual checks,
findings, and evidence. Use the target Office Accessibility Checker when
available and complete the required manual checks.

At minimum, inspect semantic titles or headings, reading order, meaningful
links, table headers, alt text, decorative objects, contrast, language metadata,
and information conveyed by color. Format-specific references may require
additional checks.

A checker that was not available does not prove accessibility. If accessibility
is required by the brief or distribution context and the required check is not
completed, status is `INCONCLUSIVE`.

## Live-source evidence

When a claim depends on a current law, regulation, policy, standard,
certification, product version, price, deadline, or other mutable fact, verify
the live official source at finalization. Record claim ID, jurisdiction when
relevant, issuing authority, official URL, publication or effective date,
retrieval timestamp, exact location, short excerpt, reviewer, and limitation.

If the official live source or scoped certificate is unavailable, label the
claim `unverified`, create an unresolved item, and use `INCONCLUSIVE` for the
affected required gate. Do not convert a stale source into `verified`.

## Unresolved items

Record every remaining defect, uncertainty, evidence gap, or accepted limitation
with:

- stable item ID, title, and description;
- severity and whether it blocks delivery;
- owner, related gate, and related artifact IDs;
- state, disposition, due date when applicable, and resolution.

An item can be `RESOLVED` only when resolution evidence exists. A
delivery-blocking item remains `OPEN` with disposition
`FIX_BEFORE_DELIVERY`. Accepted limitations are not a way to override a required
gate; user or reviewer acceptance changes ownership, not the underlying
evidence.

## Multi-file packages and source ledgers

Hash and list every delivered package member. Let each format keep its distinct
job while reconciling repeated facts, dates, units, and status labels.

For proposals and RFP responses, include the source ledger or compliance matrix
as a hashed artifact. Reconcile final slide IDs, sections, pages, cells, claims,
and assets to that ledger. For redlines, record the exact baseline hash and
authors, point the redline's `source_artifact_id` to that baseline, and include
`baseline` and `cross_artifact` acceptance checks. For financial models,
preserve the source workbook or data hashes and record independent
reconciliation evidence.

## Report validation and retention

Before delivery:

1. Parse the report as JSON.
2. Run the integrated validator. It validates Draft 2020-12
   `evidence-report.schema.json`, then applies the selected `generic`,
   `proposal`, `rfp`, or `financial-model` semantic profile and the exact
   expected count when one was specified.
4. Confirm every `artifact_id` reference resolves, `primary_artifact_id`
   identifies the final deliverable, and all SHA-256 values match the current
   files.
5. Confirm render `expected_count`, `actual_count`, and inventory length agree.
6. Confirm the overall status follows the aggregation rule.
7. Store the report with the delivery evidence or at the project-approved audit
   location.

Resolve the validator from the installed distribution root:

```powershell
$validationRequirements = Join-Path $officeSkillsRoot "scripts\requirements-validation.txt"
python -m pip install -r $validationRequirements
$evidenceValidator = Join-Path $officeSkillsRoot "scripts\validate_evidence_report.py"
python $evidenceValidator <evidence-report.json> `
  --profile <generic|proposal|rfp|financial-model> `
  --expected-count <exact-target-when-applicable>
```

The integrated validator uses JSON Schema for structure and core status
consistency, then checks references, counts, profiles, and cross-field
invariants. It still cannot prove that a path exists or a recorded hash matches
the current file. Perform those artifact checks separately and record their
command or method as evidence.
