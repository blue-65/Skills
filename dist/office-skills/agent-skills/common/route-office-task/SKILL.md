---
name: "route-office-task"
description: "Route Microsoft Office work to Word, PowerPoint, Excel, or a deliberate multi-file package. Use when the requested output format is unclear, multiple Office formats are mentioned, or a source set must be split by communication job."
---

# Route an Office task

## Outcome

Choose one primary editable artifact and a minimal supporting package whose formats match how the audience will read, decide, present, or calculate.

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

1. State the audience, decision, action, and delivery setting in one sentence.
2. Inspect every supplied file and identify which format currently owns each fact, calculation, and visual.
3. Choose Word for narrative retention, PowerPoint for live decision communication, and Excel for calculations and structured updates.
4. Assign one source of truth to repeated facts and metrics before creating a multi-file package.
5. Route implementation to the narrowest matching skill and attach the required verification gate.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Every requested outcome has one owning artifact.
- No dense content is copied unchanged into all formats.
- Repeated metrics have one source of truth and one as-of date.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
