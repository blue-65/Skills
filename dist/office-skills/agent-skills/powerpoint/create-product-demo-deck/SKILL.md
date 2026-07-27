---
name: "create-product-demo-deck"
description: "Create a PowerPoint product demo or product-proof deck. Use when the interface, workflow, or system behavior must demonstrate value instead of serving as decoration."
---

# Create a product demo deck

## Outcome

Show a deterministic product journey from input through processing, review, approval, output, and recovery.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the powerpoint production reference](../../../references/powerpoint-production.md) for format-specific requirements.
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Choose one realistic user job and one complete success path.
2. Capture or recreate product states at consistent scale and resolution.
3. Label input, processing, draft, edit, approval, publish, and exception states.
4. Pair each product state with the business friction it removes and evidence it creates.
5. Avoid screenshots that cannot be read at presentation distance.
6. Run the demo sequence and verify every crop, label, and claim.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-powerpoint](../verify-powerpoint/SKILL.md).


## Verification

- Give every slide one narrative job and one primary claim.
- Preserve masters, layouts, placeholders, notes, and native editability.
- Render every slide and run the slide show for motion, media, links, or triggers.
- The interface is evidence, not a decorative thumbnail.
- Demo data is labeled as real, synthetic, or illustrative.
- Failure and approval states are represented.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
