---
name: "audit-office-accessibility"
description: "Audit Word, PowerPoint, and Excel artifacts for accessibility. Use before public, regulated, educational, government, or broad internal distribution."
---

# Audit Office accessibility

## Outcome

Identify and fix barriers in structure, reading order, contrast, alt text, links, tables, charts, and document navigation.

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

1. Identify the target audience, assistive technology expectations, and required standard.
2. Run the Office Accessibility Checker when the target application is available.
3. Inspect semantic headings, reading order, tables, links, alt text, color use, and language metadata.
4. Verify keyboard and form interaction where controls are present.
5. Fix high-impact issues without damaging template fidelity.
6. Re-run the checker and visually review the changed artifact.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../manage-office-sources/SKILL.md) and [audit-office-claims](../audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Color is not the only carrier of meaning.
- Decorative objects are marked appropriately.
- Tables have meaningful headers and avoid merged data cells.
- The audit result distinguishes checked, fixed, and untestable items.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
