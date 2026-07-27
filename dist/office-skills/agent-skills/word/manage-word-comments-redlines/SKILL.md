---
name: "manage-word-comments-redlines"
description: "Add, review, resolve, accept, reject, or summarize Word comments and tracked changes. Use for legal, editorial, procurement, or collaborative DOCX review workflows."
---

# Manage Word comments and redlines

## Outcome

Preserve an auditable review trail while producing the exact redline, clean copy, or comment state requested.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the word production reference](../../../references/word-production.md) for format-specific requirements.
- Read [rfp response patterns](../../../references/rfp-response-patterns.md).
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

1. Require the baseline file, requested output states, and authority to accept, reject, resolve, or add review items; ask when missing or provide only a read-only summary marked INCONCLUSIVE.
2. Record the baseline path and SHA-256 plus author, comment, insertion, deletion, and move counts before editing.
3. Inspect existing authors, tracked changes, comments, and document protection.
4. Anchor comments to the narrowest relevant text and state the requested action.
5. Resolve or preserve review items according to authority, never by blanket deletion.
6. For an RFP, link each comment or tracked disposition to the exact compliance-matrix row and Word response section.
7. Create separate clean and review copies when both are needed.
8. When an approved edit changes a material claim, rerun manage-office-sources and audit-office-claims.
9. Verify final review counts, anchors, visible markup, and both saved outputs with verify-office-deliverable because static renderers may omit review state.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-office-deliverable](../../common/verify-office-deliverable/SKILL.md) with the Word production checks.


## Verification

- Use real Word styles, fields, numbering, captions, sections, and table geometry.
- Update fields and the table of contents before saving the final DOCX.
- Render and inspect every page; structural extraction is not visual verification.
- No review history is discarded without authorization.
- Baseline-to-review count changes reconcile to an authorized disposition log.
- Clean and redline files are clearly named and not confused.
- Comment anchors and tracked-change ranges remain valid.
- Every RFP disposition resolves to an exact matrix row and Word response location.
- Missing authority or an unavailable live Word review remains INCONCLUSIVE.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
