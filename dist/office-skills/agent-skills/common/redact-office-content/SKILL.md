---
name: "redact-office-content"
description: "Redact or anonymize sensitive information in Word, PowerPoint, and Excel while preserving usable layout. Use for external sharing, legal review, privacy requests, or client-safe sample preparation."
---

# Redact Office content

## Outcome

Produce a new sanitized artifact with content, metadata, comments, hidden material, and embedded objects reviewed for disclosure risk.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Define the sensitive data classes and the required irreversibility level.
2. Work on a copy and inventory visible text, notes, comments, hidden rows or slides, formulas, metadata, and embedded files.
3. Replace or remove sensitive values without leaving recoverable layers or linked sources.
4. Scrub author, revision, custom property, and hidden content metadata when authorized.
5. Reopen the final file and search for original values and patterns.
6. Render the artifact and inspect spacing, broken references, and disclosure through context.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Redaction is not a black shape placed over live sensitive text.
- Speaker notes, comments, hidden sheets, and tracked changes are included in scope.
- The original remains preserved separately.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
