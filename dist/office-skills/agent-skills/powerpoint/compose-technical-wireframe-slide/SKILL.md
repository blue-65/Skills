---
name: "compose-technical-wireframe-slide"
description: "Compose a PowerPoint technical wireframe, exploded view, annotated product view, or component breakdown. Use when parts, layers, interfaces, or specifications need precise callouts."
---

# Compose a technical wireframe slide

## Outcome

Create an editable annotated view with sparse labels, routed connectors, clear hierarchy, and enough context to understand the whole.

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

1. Choose the object, system, or interface boundary being explained.
2. Separate the base view, layers, callouts, connectors, and supporting metrics.
3. Place labels outside the focal object when possible and route leaders cleanly.
4. Use consistent numbering or label syntax only when sequence matters.
5. Limit annotations to facts required for the slide's claim.
6. Inspect at presentation distance and in exported PDF.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-powerpoint](../verify-powerpoint/SKILL.md).


## Verification

- Give every slide one narrative job and one primary claim.
- Preserve masters, layouts, placeholders, notes, and native editability.
- Render every slide and run the slide show for motion, media, links, or triggers.
- Callouts do not overlap or cross ambiguously.
- Labels identify real parts or behaviors.
- The base object remains recognizable after annotation.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
