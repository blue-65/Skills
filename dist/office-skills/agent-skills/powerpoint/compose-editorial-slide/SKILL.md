---
name: "compose-editorial-slide"
description: "Compose a PowerPoint slide with editorial hierarchy, asymmetry, columns, rules, media bands, and deliberate negative space. Use for chapter, strategy, technology, or case-study slides that need a premium but restrained voice."
---

# Compose an editorial slide

## Outcome

Create an asymmetric but stable composition that prioritizes one headline, one evidence surface, and a disciplined reading order.

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

1. Choose the primary claim and one dominant visual or text block.
2. Establish columns, alignment anchors, and a controlled asymmetry.
3. Use rules, metadata, and mono labels only when they carry information.
4. Keep body copy short and avoid ornamental editorial scaffolding.
5. Balance dense and open regions without shrinking type.
6. Inspect reading order, contrast, and static export.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-powerpoint](../verify-powerpoint/SKILL.md).


## Verification

- Give every slide one narrative job and one primary claim.
- Preserve masters, layouts, placeholders, notes, and native editability.
- Render every slide and run the slide show for motion, media, links, or triggers.
- Asymmetry remains aligned rather than accidental.
- Tiny uppercase labels are not repeated as decoration.
- The slide has one unmistakable focal point.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
