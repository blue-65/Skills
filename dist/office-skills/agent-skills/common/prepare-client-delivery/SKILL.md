---
name: "prepare-client-delivery"
description: "Prepare verified Office artifacts for client or executive handoff. Use when a working file must become a clean delivery package with controlled versions, filenames, metadata, and supporting exports."
---

# Prepare an Office delivery

## Outcome

Deliver only intentional final files with clear version identity, matching metrics, clean metadata, and documented verification.

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

1. Confirm the exact requested formats, filenames, version labels, and destination.
2. Separate source, working, review, redline, and clean delivery copies.
3. Reconcile repeated dates, units, metrics, terminology, and status labels across files.
4. Remove temporary assets, unresolved placeholders, and unapproved comments.
5. Run the complete verification gate on the exact files being delivered.
6. Report what changed, what was verified, and what remains limited.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- No scratch render or builder is included unless requested.
- The clean copy does not silently erase required review history.
- Every delivered file opens from its final path.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
