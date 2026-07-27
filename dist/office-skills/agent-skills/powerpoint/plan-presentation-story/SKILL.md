---
name: "plan-presentation-story"
description: "Plan the narrative arc, slide sequence, and communication job for a PowerPoint deck. Use before creating or substantially restructuring a presentation."
---

# Plan a presentation story

## Outcome

Define a deck whose slides accumulate toward one audience decision, understanding, or action.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the powerpoint production reference](../../../references/powerpoint-production.md) for format-specific requirements.
- Read [proposal deck patterns](../../../references/proposal-deck-patterns.md).
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Require the audience, setting, time limit, decision, central evidence, and any hard slide target; ask for missing inputs or label the outline as a skeleton with INCONCLUSIVE status.
2. Write one takeaway claim for every numbered slide and, when an exact count is required, allocate exactly that many audience-facing slides while classifying appendix and hidden slides explicitly.
3. Order slides by the audience's decision logic rather than source order.
4. Assign a visual proof type and evidence owner to each claim: product, chart, comparison, process, image, or concise text.
5. Make the production handoff require manage-office-sources and audit-office-claims before authoring and verify-powerpoint before delivery.
6. Remove slides that repeat a point or exist only as decoration.
7. Assert the planned slide count and check that the opening establishes stakes and the ending resolves the requested action.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-powerpoint](../verify-powerpoint/SKILL.md).


## Verification

- Give every slide one narrative job and one primary claim.
- Preserve masters, layouts, placeholders, notes, and native editability.
- Render every slide and run the slide show for motion, media, links, or triggers.
- A hard slide target equals the numbered audience-facing inventory, with appendix and hidden-slide treatment stated.
- Every slide has one narrative job.
- Adjacent slides change the audience's understanding.
- Every planned external claim has a source state and owner.
- A labeled skeleton is not represented as a complete presentation plan.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
