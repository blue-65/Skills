---
name: "verify-office-deliverable"
description: "Run the final delivery gate for Word, PowerPoint, or Excel artifacts. Use after any meaningful create or edit batch and before handing an Office file to the user."
---

# Verify an Office deliverable

## Outcome

Confirm save integrity, structural correctness, calculation or field freshness, and complete visual quality in the final saved artifact.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [execution runtime](../../../references/execution-runtime.md).
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

1. Require the final absolute path, artifact type, acceptance brief, and any exact page or slide count or named target; ask for missing inputs and otherwise return INCONCLUSIVE.
2. Save and read back the final absolute path, format, size, and application state.
3. Reopen or reattach to the saved artifact and refresh fields, calculations, links, and slide state as applicable.
4. Run the relevant format verifier independently of the generator: Word production checks, verify-powerpoint, or verify-excel-workbook.
5. Run a format-specific structural issue scan and placeholder search.
6. Render every page, slide, or used worksheet and inspect each one individually.
7. Test runtime-only behavior in the actual Office application.
8. Repair defects and repeat the required gates, stopping after three non-converging cycles.
9. Write UTF-8 evidence JSON with artifact path and SHA-256, verifier and Office version, expected and observed targets, and acceptance_checks records containing id, category, method, evidence location, expected, observed, tolerance, status, met, and limitations.
10. Validate the report against evidence-report.schema.json and run validate_evidence_report.py with the matching generic, proposal, rfp, or financial-model profile before assigning PASS.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Required SKIP results produce INCONCLUSIVE, never PASS.
- Any required exact page or slide count and named target matches the reopened artifact.
- Every PASS cites independent readback, calculation, or render evidence rather than the generator's own assertion.
- Automated checks and visual inspection both completed.
- The evidence JSON is parseable and records every failed, skipped, or inconclusive check and unresolved limitation.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
