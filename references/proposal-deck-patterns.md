# Proposal deck patterns

Use this reference for client proposals, enterprise solution decks, procurement
presentations, executive investment cases, and commercial pitch decks. The user
brief, buyer instructions, supplied template, and target project design system
take precedence. The [PowerPoint production reference](powerpoint-production.md)
and [Office output contract](office-output-contract.md) remain the delivery
floor.

A proposal deck is a decision artifact. It must make the offered scope,
evidence, controls, economics, limitations, and next decision clear within the
approved slide limit. It must not manufacture confidence through unsupported
customer claims, security language, or financial projections.

## Decision and input preflight

Before storyboarding, record:

- audience, meeting setting, presenter, time limit, decision owner, requested
  decision, and consequence of delay;
- buyer problem, desired outcome, decision criteria, current process, users,
  constraints, and explicit exclusions;
- solution scope, delivery boundary, dependencies, human approvals, failure
  recovery, acceptance criteria, and commercial owner;
- exact slide rule, including whether cover, agenda, divider, closing, backup,
  and appendix slides count;
- template or visual authority, final aspect ratio, language, accessibility
  requirement, and static-export requirement;
- source ledger path, source cutoff, claim owners, and final verifier.

Do not make slide layouts until the evidence gates below have been evaluated.

## Evidence input gates

### Customer evidence gate

For each customer, case, quote, logo, benchmark, or outcome, require:

- customer identity and approved naming level;
- written permission or approved public-use basis for name, logo, quote, and
  identifiable screenshots;
- baseline, intervention, measurement period, sample or population, metric
  definition, units, and source;
- attribution and causality boundary;
- evidence path, author or owner, as-of date, retrieval date, and hash when
  file-based;
- internal approver and any expiry or channel restriction.

An anecdote is not a measured outcome. A calculated result must identify the
formula and input source. If evidence is incomplete, remove the claim, anonymize
it with approval, or label it `unverified`; do not present it as customer proof.

### Security gate

Require current evidence for every material security, privacy, compliance, data
residency, deployment, audit, or certification statement:

- service and environment in scope;
- architecture and data-flow boundary;
- identity, access, encryption, key, logging, retention, deletion, isolation,
  incident, recovery, and human-approval controls relevant to the claim;
- certification, attestation, assessment, or test name, issuing organization,
  scope, region, version, issue date, expiry date, exceptions, and evidence;
- subprocessors and partner dependencies;
- security owner approval and approved wording.

Do not infer current regulatory or certification status from memory or a prior
deck. Verify the official issuer's live source and the current scoped evidence
at finalization. If that check is unavailable, use `unverified` and make the
affected verification gate `INCONCLUSIVE`.

### Economics gate

Require:

- pricing model, currency, term, included volume, overage, implementation,
  support, third-party, and optional costs;
- customer baseline cost or workload, source period, unit definition, and
  owner;
- benefit drivers, timing, adoption ramp, utilization, leakage, and confidence;
- source workbook and exact output cells for ROI, payback, TCO, savings,
  productivity, margin, or cash-flow claims;
- separation of observed facts, approved assumptions, scenarios, and
  recommendations;
- sensitivity or downside case for material uncertain drivers;
- finance or commercial approver and as-of date.

Do not calculate economics only inside PowerPoint. Let an auditable workbook own
formulas and link or reproduce final approved values with their source IDs.

### Gate outcomes

Use content labels separately from delivery-gate status:

- `verified`: supported by current, approved evidence;
- `assumption`: a deliberate input with owner, rationale, unit, and sensitivity;
- `unverified`: insufficient evidence or live confirmation.

An evidence gate is `PASS` when all claims planned for the deck are supported or
accurately labeled and approved. It is `REJECT` when a material claim conflicts
with evidence or uses unauthorized customer, security, or economic content. It
is `INCONCLUSIVE` when required evidence or a required live-source check is
unavailable.

## Slide-limit and storyboard budget

Treat the slide limit as a content budget, not a formatting suggestion. Record:

- `limit_type`: `exact`, `maximum`, or `range`;
- numeric limit or range;
- counted and excluded slide classes;
- main-story budget and permitted appendix budget;
- required buyer sections and immutable template slides.

For a maximum:

```text
Final counted slides <= approved maximum
```

For an exact target:

```text
Final counted slides = approved exact target
```

Count slides from the final reopened deck using the buyer's counting rule.
Hidden slides count unless the rule explicitly excludes them. Do not add empty
dividers, decorative filler, duplicated summaries, or unreadable backup slides
to hit a target.

Create a storyboard ledger before building the deck:

| Field | Contract |
|---|---|
| Slide ID | stable ID that survives reordering |
| Count class | main, appendix, required template, or excluded by explicit rule |
| Narrative job | one change in audience understanding |
| Takeaway claim | one sentence that the slide proves |
| Decision criterion | buyer criterion served by the slide |
| Proof form | customer evidence, product state, chart, process, comparison, security control, economics, or concise text |
| Claim IDs | source-ledger claims used on the slide |
| Asset IDs | source-ledger visuals and licenses used on the slide |
| Content status | verified, assumption, or unverified |
| Owner | accountable approver |
| Speaking time | planned duration |
| Static fallback | how the point survives PDF or image export |
| Accessibility | semantic title, reading order, alt text, and non-color status cue |

The row count must reconcile to the approved slide budget before slide
construction and after final edits.

## Minimum narrative jobs

Build the smallest story that supports the decision. Typical proposal jobs are:

1. State the buyer's decision, operational stakes, and desired outcome.
2. Show the current workflow and the specific friction being removed.
3. Show the proposed solution mechanism and boundaries.
4. Demonstrate one realistic end-to-end workflow, including human approval and
   failure recovery where material.
5. Present verified customer or product evidence.
6. Explain security, privacy, governance, and deployment controls relevant to
   the buyer.
7. Define delivery phases, owners, dependencies, acceptance criteria, and
   operating model.
8. Present economics, commercials, assumptions, and sensitivity.
9. State risks, exclusions, unresolved decisions, and the concrete next action.

These are narrative jobs, not mandatory one-slide sections. When the limit is
tight, combine compatible jobs into one coherent composition. Remove lower-value
material before shrinking type or turning a slide into a dense dashboard.
Appendix slides may hold diligence detail only when the rules permit them; the
main decision cannot depend on a hidden appendix.

## Claim and visual treatment

Every visible claim must resolve to a source-ledger entry or an approved
assumption. Use the following rules:

- Put verified headline facts in visible slide content and traceable sources in
  speaker notes or the approved citation surface.
- Label material assumptions next to the number or statement, not only in
  speaker notes. Include scenario and as-of date.
- Use `unverified` visibly when the audience must see an unresolved item.
  Otherwise remove the unsupported claim from the deck.
- Never replace missing evidence with generated imagery, fabricated logos,
  synthetic testimonials, invented interface states, or decorative charts.
- Label demo data and screenshots as real, synthetic, or illustrative.
- Separate current capability, configuration, customization, roadmap, and
  partner dependency.
- Keep exact security scope and certification limitations with the claim.
- Use honest chart axes, comparable periods, defined units, and editable or
  traceable source data.

## Source ledger

Maintain one ledger for claims, data, customer evidence, screenshots, logos,
icons, diagrams, and external assets. At minimum, record:

| Field | Purpose |
|---|---|
| Source ID | stable identifier |
| Claim or asset ID | exact item used in the deck |
| Slide IDs | every final slide that uses the item |
| Type | fact, calculation, assumption, quote, logo, screenshot, image, chart data, or template |
| Content status | verified, assumption, or unverified |
| Author or organization | accountable origin |
| Title or system | source identity |
| Canonical URL or absolute path | retrieval location |
| Exact location | page, section, table, cell, range, record, or timestamp |
| Published and as-of dates | evidence period |
| Retrieval timestamp | when it was checked |
| Short excerpt or calculation | exact support for the claim |
| Rights or permission | usage basis and restriction |
| Hash | SHA-256 for file-based evidence |
| Owner and approver | responsible people or roles |
| Limitation | scope, confidence, caveat, or expiry |

Use stable slide IDs rather than slide numbers as the primary join. Update the
slide number in the ledger after final ordering. A speaker-note citation that
does not resolve to the ledger is a defect.

## Composition and accessibility

Apply the supplied template or project design system. Without one, use the
repository `DESIGN.md`: restrained, information-rich, native, and editable.
Keep one primary claim and one dominant proof surface per slide. Preserve
minimum type sizes from the PowerPoint production reference, shorten copy before
shrinking type, and avoid nested cards, decorative gradients, tiny repeated
labels, and interface-like chrome around ordinary content.

Give every slide a unique semantic title, including an off-slide title when the
visible composition omits one. Set logical reading order, add reviewed alt text
to informative visuals, mark decorative objects appropriately, and pair color
with labels, symbols, or direct annotation. Confirm that every required point
survives a static PDF or image export.

## Final verification and ledger reconciliation

Freeze the final deck and source ledger together. Then:

1. Save and reopen the exact final PPTX and read back the final slide count,
   masters, layouts, notes, links, media, and hidden-slide inventory.
2. Hash the final deck, source ledger, linked economics workbook, and governing
   template or baseline.
3. Reconcile every final slide ID, visible claim, note citation, chart, and asset
   to the source ledger.
4. Confirm the slide-limit equation using the final reopened slide inventory.
5. Scan for placeholders, duplicate or missing titles, unsupported claims,
   unlabeled assumptions, broken sources, overflow, overlap, bad connectors,
   low contrast, and inaccessible reading order.
6. Render every slide and inspect each one at presentation size; inspect a
   montage for pacing and repeated silhouettes.
7. Run the final slide show for required motion, media, links, triggers, and
   presenter-flow dependencies.
8. Run the required accessibility check and inspect the static export.
9. Record every unresolved item, owner, severity, and delivery disposition.

Create the final evidence report using
[the verification evidence contract](verification-evidence.md) and
`evidence-report.schema.json`. Include the source ledger as a hashed related
artifact and reference it from scan findings or unresolved items when a claim
cannot be verified.

Before delivery, run the semantic evidence validator with `--profile proposal`
and the exact slide target. Its acceptance checks must separately cover
customer, security, economic, source-ledger, and cross-artifact evidence.

An exceeded slide limit, material unsupported claim, unauthorized customer
evidence, or false security or economic statement is `REJECT`. A skipped
required render, runtime test, accessibility check, ledger reconciliation, or
live-source confirmation is `INCONCLUSIVE`. Use `PASS` only for the exact saved
deck whose claims, slide budget, and verification evidence all reconcile.
