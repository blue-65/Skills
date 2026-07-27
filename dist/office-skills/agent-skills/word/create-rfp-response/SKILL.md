---
name: "create-rfp-response"
description: "Create a Word response to an RFP, RFI, RFQ, or procurement questionnaire. Use when source requirements must be answered completely, traceably, and in the buyer's requested structure."
---

# Create an RFP response

## Outcome

Produce a compliant DOCX that answers every requirement, distinguishes evidence from commitments, and exposes gaps before submission.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the word production reference](../../../references/word-production.md) for format-specific requirements.
- Read [rfp response patterns](../../../references/rfp-response-patterns.md).
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Require the buyer package, response instructions or template, submission constraints, and approved company evidence; ask for missing inputs or produce only a labeled skeleton with gaps and INCONCLUSIVE status.
2. Use build-rfp-compliance-matrix to build the atomic Excel requirement ledger with exact source location, owner, status, evidence, and intended Word response location.
3. Preserve the buyer's numbering, terminology, mandatory forms, and response order.
4. Answer each requirement directly before adding context or marketing language.
5. Separate current capability, configuration, roadmap, partner dependency, and exception.
6. Record claim-level provenance for security, auditability, deployment, delivery, economics, pricing, and legal statements, including source, as-of date, owner, and exact file page or workbook cell.
7. Use manage-word-comments-redlines to create a separate tracked-change review copy, preserve existing review history, and reconcile every disposition to its compliance-matrix row and clean Word section.
8. Run manage-office-sources and audit-office-claims, then verify-office-deliverable on the clean DOCX and verify-excel-workbook on the matrix before submission.
9. Validate the package evidence with validate_evidence_report.py --profile rfp and the exact counted-page target before assigning PASS.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-office-deliverable](../../common/verify-office-deliverable/SKILL.md) with the Word production checks.
- Build the requirements ledger with [build-rfp-compliance-matrix](../../excel/build-rfp-compliance-matrix/SKILL.md) and create a separate review copy with [manage-word-comments-redlines](../manage-word-comments-redlines/SKILL.md) when redline delivery is requested.


## Verification

- Use real Word styles, fields, numbering, captions, sections, and table geometry.
- Update fields and the table of contents before saving the final DOCX.
- Render and inspect every page; structural extraction is not visual verification.
- Every mandatory requirement has one matrix status and one exact Word response location.
- No roadmap item is described as current capability.
- Every material security or economics claim has supporting evidence or an explicit unverified label.
- The matrix, clean DOCX, and redline share a version identifier and reconcile without discarded review history.
- A labeled skeleton, missing mandatory answer, or failed required companion workflow remains INCONCLUSIVE and is not submission-ready.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
