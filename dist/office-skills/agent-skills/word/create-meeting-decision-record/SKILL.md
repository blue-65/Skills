---
name: "create-meeting-decision-record"
description: "Create a Word meeting brief, minutes, decision log, or action record. Use when discussion must be converted into decisions, owners, deadlines, evidence, and follow-up."
---

# Create a meeting and decision record

## Outcome

Produce a concise record that distinguishes discussion from decisions and makes follow-up operational.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the word production reference](../../../references/word-production.md) for format-specific requirements.
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Identify meeting purpose, participants, date, source notes, and confidentiality.
2. Separate context, evidence, options, decisions, open questions, and actions.
3. Record each decision with owner, date, rationale, and affected scope.
4. Record each action with owner, due date, dependency, and completion evidence.
5. Flag uncertain wording for confirmation instead of inventing consensus.
6. Render and review for rapid scanning.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-office-deliverable](../../common/verify-office-deliverable/SKILL.md) with the Word production checks.


## Verification

- Use real Word styles, fields, numbering, captions, sections, and table geometry.
- Update fields and the table of contents before saving the final DOCX.
- Render and inspect every page; structural extraction is not visual verification.
- Every action has one accountable owner.
- Decisions are not buried inside narrative minutes.
- Unconfirmed statements are labeled.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
