---
name: "compare-office-versions"
description: "Compare two versions of Word, PowerPoint, or Excel files for content, structure, calculation, and visual changes. Use for redline review, regression checking, template fidelity, or delivery sign-off."
---

# Compare Office versions

## Outcome

Produce an evidence-backed change report that distinguishes intended edits from accidental drift.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
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

1. Confirm the baseline and candidate files and preserve both unchanged.
2. Compare Word text, styles, sections, fields, comments, and pagination.
3. Compare PowerPoint slide order, masters, layouts, objects, notes, and rendered geometry.
4. Compare Excel sheets, names, formulas, values, formats, charts, and connections.
5. Render both versions and inspect visual differences that structural comparison cannot explain.
6. Classify every material difference as intended, defect, renderer variation, or unresolved.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- The baseline is identified by path, hash, or version.
- Content, structure, and rendering are not collapsed into one vague comparison.
- No claim of equality is made from text comparison alone.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
