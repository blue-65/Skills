---
name: "build-long-word-document"
description: "Build or restructure a long Word document such as a manual, handbook, report, book, or multi-section specification. Use when navigation, section breaks, numbering, fields, cross-references, and pagination stability are central."
---

# Build a long Word document

## Outcome

Create a maintainable long document whose hierarchy, navigation, page furniture, and references update correctly.

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

1. Require purpose, audience, source set, template, required sections, and any hard page target; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.
2. Define section architecture, front matter, body, appendices, numbering, and a page budget when an exact page count is required.
3. Create semantic styles and multilevel numbering before importing content.
4. Use section breaks only when page geometry or headers require them.
5. Add contents, lists of figures or tables, bookmarks, captions, and cross-references.
6. Control keep-with-next, widow and orphan behavior, and page-break rules.
7. Run manage-office-sources and audit-office-claims for all material external claims and assets.
8. Update all fields and inspect every page, then run verify-office-deliverable with the Word production checks on the final saved DOCX.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-office-deliverable](../../common/verify-office-deliverable/SKILL.md) with the Word production checks.


## Verification

- Use real Word styles, fields, numbering, captions, sections, and table geometry.
- Update fields and the table of contents before saving the final DOCX.
- Render and inspect every page; structural extraction is not visual verification.
- Heading numbering and TOC levels agree.
- Headers, footers, and page numbers change only at intended section boundaries.
- A required exact page count equals the reopened Word page count; otherwise only the observed count is reported.
- No blank pages are created by accidental breaks.
- Unresolved evidence, a labeled skeleton, or a failed Word verification gate blocks delivery.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
