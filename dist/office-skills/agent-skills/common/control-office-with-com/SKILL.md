---
name: "control-office-with-com"
description: "Control visible Microsoft Word, PowerPoint, or Excel desktop applications with Windows COM automation. Use when editing an open Office file, preserving native fidelity, testing application behavior, or rendering through the installed Office application."
---

# Control Office with COM

## Outcome

Apply a bounded batch of changes in the real Office application without closing user work or inventing unsupported object-model behavior.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [execution runtime](../../../references/execution-runtime.md).
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Require the exact source path, Office application, output mode, and page, slide, or range target; ask for any missing required input instead of guessing.
2. Confirm Windows desktop Office and the required COM library are available.
3. Resolve every source and output path to an absolute path.
4. Attach to the existing application and reuse an open document whose FullName matches the target.
5. Resolve the target to an application-native page number, SlideID and slide index, or worksheet and address; assert that it exists and capture its before state.
6. Probe uncertain methods or properties on a disposable artifact before touching the source.
7. Execute related COM calls in one process, save explicitly, and read back the saved path and document state.
8. For changed external claims or assets, run manage-office-sources and audit-office-claims; always run verify-office-deliverable and its format-specific verifier before reporting completion.
9. Keep the application visible and reveal the changed page, slide, or range unless the user requested a closed batch job.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Collections are treated as one-based where the Office object model requires it.
- SaveAs uses an explicit format constant.
- No mutation begins until both FullName and the exact target assertion match the request.
- No application, document, presentation, or workbook is closed without authorization.
- Unsupported features are reported instead of silently replaced.
- The evidence record names the Office version, final FullName, exact target identifier, operation, before and after readback, and status.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
