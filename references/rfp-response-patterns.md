# RFP response patterns

Use this reference for RFP, RFI, RFQ, tender, grant, and procurement responses.
The buyer's solicitation, amendments, portal instructions, mandatory forms, and
contract terms are the governing authority. The
[Word production reference](word-production.md),
[Excel production reference](excel-production.md), and
[Office output contract](office-output-contract.md) remain the delivery floor.

Do not infer current public-sector law, policy, certification, or procurement
rules from memory. Verify applicable requirements against live official sources
for the named jurisdiction and retrieval date. If live verification is
unavailable, record the item as `unverified` and the affected gate as
`INCONCLUSIVE`; never claim legal or regulatory compliance from a stale summary.

## Mandatory source preflight

Complete preflight before drafting any submission-ready prose. Inventory the
following inputs and give each one a status, owner, source location, as-of date,
and SHA-256 hash when file-based.

| Input | Minimum evidence |
|---|---|
| Primary solicitation | complete official RFP, RFI, RFQ, or tender document |
| Amendments | every addendum, clarification, corrigendum, and question-and-answer release |
| Submission instructions | portal or address, deadline, time zone, file names, formats, size limits, signatures, and packaging |
| Response structure | required numbering, template, forms, attachments, page rules, font, margins, and language |
| Evaluation | mandatory gates, scored criteria, weights, demonstrations, interviews, and tie-break rules when stated |
| Scope and requirements | functional, technical, service, delivery, reporting, accessibility, security, privacy, and data requirements |
| Commercials | pricing form, currency, tax treatment supplied by the buyer, validity period, and contract term |
| Contract baseline | draft agreement, terms, schedules, service levels, data-processing terms, and permitted redline method |
| Bidder evidence | legal entity, registrations, insurance, financials, references, team, certifications, and authorized claims |
| Governance | response owner, requirement owners, legal reviewer, security reviewer, pricing owner, and final approver |
| Live official sources | current issuing-authority pages needed for jurisdiction-specific law, regulation, policy, or certification claims |

Preflight is `PASS` only when the complete governing source set and response
owners are available. Contradictory official instructions, corrupted sources,
or an expired submission that the user still intends to file are `REJECT` until
resolved. A required source that cannot be obtained or verified is
`INCONCLUSIVE`.

### When the solicitation source is absent

Stop submission drafting when the primary solicitation or its mandatory
instructions are absent. Do not invent requirements, section numbers, buyer
priorities, compliance statuses, or page limits.

Only create a framework if the user explicitly asks for one. Label every page
and sheet:

```text
SKELETON — SOLICITATION SOURCE NOT PROVIDED — NOT FOR SUBMISSION
```

The framework may contain questions, neutral headings, owner fields, and empty
evidence slots. It must not contain `compliant`, `meets`, `certified`, or similar
claims. Its overall gate status is `INCONCLUSIVE`, and the missing solicitation
must remain the first unresolved item.

## Baseline manifest and authorship

Preserve each received source unchanged. Create a baseline manifest before
extraction or conversion with:

- `source_id`, absolute path or canonical URL, filename, byte size, format, and
  SHA-256 hash;
- issuing organization and named document author when stated in the source;
- Office or PDF metadata author as a separate field, never as proof of issuer;
- published, received, and retrieved timestamps with time zone;
- solicitation number, version, amendment number, and relationship to the
  primary solicitation;
- transfer or retrieval method and the operator who recorded the source;
- authority level: governing, amendment, buyer clarification, bidder evidence,
  reference only, or superseded.

Use the exact baseline hash in every comparison and redline record. If the
source changes, add a new manifest record; do not replace the old hash. A
converted PDF or extracted text is derivative evidence and cannot silently
become the redline baseline when an authoritative DOCX is available.

For a redline, record both:

- `baseline_author`: issuing organization, named source author if present, and
  source metadata author;
- `candidate_author`: organization and person or review account responsible for
  the proposed changes.

Do not normalize Track Changes authors, accept revisions, or remove comments
unless the responsible reviewer explicitly authorizes it.

## Atomic requirement inventory

Split the source into atomic requirements without losing buyer numbering or
exact wording. One row may represent one requirement, or an explained set of
child rows may split a compound requirement.

The compliance matrix must include at least:

| Field | Contract |
|---|---|
| Requirement ID | stable internal ID |
| Buyer reference | exact section, clause, form, table, page, and item number |
| Exact requirement | verbatim source text within applicable quotation limits |
| Requirement type | mandatory, scored, contractual, informational, form, or submission |
| Mandatory | controlled Boolean or buyer-defined state |
| Response owner | one accountable person or role |
| Response status | controlled value from the response-status vocabulary |
| Direct response | concise answer before explanation |
| Evidence ID | source-ledger link to current proof |
| Evidence location | exact file, section, page, sheet, cell, slide, or system record |
| Commitment class | current, configuration, customization, roadmap, partner-dependent, or exception |
| Word location | final heading, numbered item, table, or appendix |
| Redline location | clause and revision or comment identifier |
| Gap and action | missing proof, decision, owner, due date, and blocker |
| Last verified | timestamp, verifier, and verification method |

Use these response statuses and do not confuse them with verification-gate
statuses:

- `COMPLIANT`: current capability and evidence satisfy the requirement as
  written;
- `CONFIGURABLE`: satisfied through documented, in-scope configuration;
- `CUSTOMIZATION_REQUIRED`: requires build or change that is explicitly scoped;
- `PARTNER_DEPENDENT`: relies on a named third party and verified dependency;
- `ROADMAP`: not current capability and tied to an approved roadmap statement;
- `EXCEPTION`: requirement is not accepted or not met as written;
- `UNANSWERED`: no approved response yet.

An evidence gap cannot be hidden by choosing `COMPLIANT`. Use `UNANSWERED` or
the accurate commitment class until the evidence owner approves the response.

## Exact page-target contract

Record page rules before allocating content:

- whether the rule is an exact target, a maximum, a range, or a per-section
  limit;
- the numeric target and whether cover, contents, forms, dividers, references,
  appendices, resumes, and redlines count;
- required page size, orientation, margins, font, minimum type size, spacing,
  headers, footers, and file format;
- the buyer's counting method when the portal, Word, and PDF counts could differ;
- treatment of intentionally blank pages and mandatory buyer forms.

Create a page-budget table with one row per required section:

```text
Counted main pages =
  sum(final rendered pages included by the buyer's counting rule)
```

For an exact target, the final counted pages must equal the target. For a cap,
they must not exceed it. The section allocations must reconcile to the target
before drafting and again after final pagination. Do not add decorative filler,
blank pages, enlarged type, or diluted prose merely to hit a count. If mandatory
buyer content cannot fit without violating legibility or format rules, stop and
raise a page-budget exception.

Update fields and the table of contents, save, reopen, render the final DOCX or
required PDF, and count using the buyer's stated method. An approximate count
from extracted text or an editor status bar is not final evidence.

## Response drafting pattern

Answer each requirement in this order:

1. Give a direct response using the buyer's terminology.
2. State the current capability or explicit exception.
3. Name configuration, customization, partner, or roadmap dependency.
4. Cite exact evidence and its as-of date.
5. State delivery owner, timing, acceptance evidence, and limitation when the
   requirement creates a commitment.

Separate facts, commitments, and recommendations. Do not recast a planned
feature as current, a marketing claim as security evidence, or a certificate
held by a subprocessor as the bidder's own certification.

## Word, Excel, and redline package

Unless the solicitation prescribes a different package, prepare distinct files
with distinct jobs:

| Artifact | Job |
|---|---|
| Clean response DOCX | buyer-facing narrative in required order and styles |
| Compliance matrix XLSX | filterable atomic requirement register, owners, evidence, status, gaps, and final locations |
| Redline DOCX | Track Changes against the exact hashed contract baseline |
| Redline issue log | clause, change ID, reason, business impact, fallback, owner, and decision |
| Submission manifest | filenames, formats, sizes, hashes, baseline relationships, authors, and final gate status |

Include buyer-provided forms and pricing workbooks only in their required native
formats. Never replace a required Excel form with a screenshot or transpose a
required Word form into a custom template.

The final compliance matrix must reconcile to the final clean response and
redline. Every `Word location` and `Redline location` must resolve after fields,
pagination, and revisions are finalized. Every mandatory requirement must have
one final response status; `UNANSWERED`, `ROADMAP`, and `EXCEPTION` rows remain
visible in the approval summary.

## Public-sector AI security and privacy checklist

Treat this as a discovery and evidence checklist, not a universal statement of
law. For every applicable row, record jurisdiction, issuing authority, official
URL, document title and version, effective or publication date, retrieval
timestamp, exact supporting section, short source excerpt, applicability
decision, evidence ID, owner, response status, and reviewer.

Check at least:

- system purpose, affected population, decision consequence, prohibited uses,
  and required human authority;
- data inventory, classification, personal or sensitive information, lawful
  basis supplied by counsel, minimization, purpose limitation, and collection
  notice;
- data residency, cross-border transfer, government-access constraints, and
  approved deployment boundary;
- controller, processor, operator, model provider, subprocessor, and partner
  responsibilities;
- prompt, file, output, telemetry, and feedback retention, deletion, archival,
  legal hold, public-record, and freedom-of-information handling;
- whether customer data, prompts, outputs, or feedback are used for model
  training, evaluation, or service improvement, including opt-out controls;
- identity, MFA, role-based access, least privilege, privileged access, tenant
  isolation, and segregation of duties;
- encryption in transit and at rest, key ownership, rotation, secrets handling,
  and customer-managed key requirements;
- audit logs, model and prompt versioning, administrator actions, export,
  tamper protection, retention, and evidence availability;
- secure development, dependency and model supply chain, SBOM or equivalent
  inventory, vulnerability handling, patching, testing, and change control;
- model evaluation, bias and performance testing, red teaming, content safety,
  hallucination handling, monitoring, drift, and rollback;
- explainability, contestability, appeal, manual override, approval, and
  recordkeeping for consequential decisions;
- incident response, breach and AI-incident classification, notification
  authority, forensic evidence, tabletop testing, and escalation;
- availability, capacity, backup, disaster recovery, business continuity,
  offline or degraded mode, and exit portability;
- accessibility, language support, records management, procurement audit,
  subcontractor flow-down, and public transparency obligations;
- certifications, attestations, government cloud requirements, security
  assessments, penetration tests, and scope boundaries;
- end-of-contract return, deletion, verification, transition assistance, and
  residual model or cache data.

For laws, policies, and certifications, verify the official issuer's live
source at finalization. Record scope, entity, service, region, version, expiry,
and exceptions. If the current official source or certificate evidence is not
available, use `unverified`; do not write “compliant,” “certified,” or “meets all
requirements.”

## Completeness and final verification

Before delivery:

1. Freeze and hash the final governing-source manifest.
2. Reconcile every atomic requirement to exactly one matrix row or documented
   child-row split.
3. Reconcile matrix locations to the final clean DOCX, required forms, pricing
   workbook, and redline.
4. Confirm the exact page target or cap through the final rendered artifact.
5. Compare the redline against the recorded baseline hash and inspect Track
   Changes authors, comments, revisions, and clause anchors.
6. Scan for `UNANSWERED`, unsupported `COMPLIANT` claims, placeholders,
   inconsistent dates, missing signatures, broken cross-references, and package
   naming errors.
7. Render every Word page and every used Excel sheet or print area and inspect
   them individually.
8. Run required accessibility and live Office interaction checks.

Record final paths and SHA-256 hashes, baseline hashes and authors, reopen
evidence, scans, render inventory, runtime results, accessibility results, and
unresolved items using
[the verification evidence contract](verification-evidence.md) and
`evidence-report.schema.json`.

Before delivery, run the semantic evidence validator with `--profile rfp` and
the buyer's exact counted-page target when one exists. A profile failure is
`REJECT`; a missing source, application, or live verification capability is
`INCONCLUSIVE`.

Any mandatory unanswered requirement, page-rule breach, mismatched redline
baseline, or unsupported compliance claim is `REJECT`. A missing required
source, unavailable live legal check, or skipped required verification is
`INCONCLUSIVE`. Use `PASS` only when the exact final package is complete and
evidenced.
