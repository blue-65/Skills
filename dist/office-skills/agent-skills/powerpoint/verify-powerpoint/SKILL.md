---
name: "verify-powerpoint"
description: "Verify a final PowerPoint deck for structure, visual quality, narrative, accessibility, sources, and runtime behavior. Use after creating or editing a PPTX and before delivery."
---

# Verify a PowerPoint deck

## Outcome

Confirm the exact saved deck is coherent, readable, editable, sourced, and free of unintended slide defects.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the powerpoint production reference](../../../references/powerpoint-production.md) for format-specific requirements.
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

1. Require the final absolute PPTX path, acceptance brief, exact expected slide count or named slide targets, and runtime requirements; ask for missing inputs and otherwise return INCONCLUSIVE.
2. Save and reopen the exact final PPTX, record its SHA-256, and assert the observed slide count and each target by slide index, SlideID, and title.
3. Run a structural scan independent of the deck generator for placeholders, blank slides, canvas overflow, text overflow, overlaps, low contrast, and broken links.
4. Render every slide individually and inspect a montage for pacing.
5. Verify charts, tables, diagrams, image crops, footers, and page markers.
6. Run the slide show for animation, Morph, media, links, and triggers.
7. Repair defects and repeat the complete visual and runtime gates.
8. Write UTF-8 evidence JSON with artifact path and SHA-256, Office and verifier versions, expected and observed slide targets, and acceptance_checks records containing method, evidence location, expected, observed, tolerance, status, met, and limitations.
9. Validate the report against evidence-report.schema.json and run validate_evidence_report.py with the matching profile and exact slide target before assigning PASS.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.


## Verification

- Give every slide one narrative job and one primary claim.
- Preserve masters, layouts, placeholders, notes, and native editability.
- Render every slide and run the slide show for motion, media, links, or triggers.
- The exact slide count and every named target match the reopened deck under the agreed appendix and hidden-slide rule.
- No title wraps unexpectedly.
- No connector crosses through a node or label.
- Every external claim and asset has a source.
- Static export communicates all required points.
- Every PASS is backed by independent scan, render, or runtime evidence, and required SKIP results remain INCONCLUSIVE.
- The evidence JSON is parseable and includes every failed, skipped, or inconclusive check.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
