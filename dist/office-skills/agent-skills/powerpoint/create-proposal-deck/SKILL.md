---
name: "create-proposal-deck"
description: "Create a PowerPoint proposal or solution deck for a client, procurement process, or internal sponsor. Use when the audience needs problem framing, solution scope, delivery, controls, evidence, commercials, and next steps."
---

# Create a proposal deck

## Outcome

Produce a proposal deck that is persuasive in a meeting and precise enough to support delivery and approval.

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

1. Require the buyer brief, operational problem, decision criteria, approved evidence, commercial assumptions, and any exact slide target; ask for missing inputs or produce only a labeled skeleton with INCONCLUSIVE status.
2. Create a numbered storyboard that exactly matches any required audience-facing slide count and identifies appendix or hidden slides separately.
3. Show what the solution does, where it stops, who approves actions, and how failures recover.
4. Connect each capability to a workflow, owner, control, and measurable result.
5. Separate current capability, configuration, customization, roadmap, and dependency.
6. Record claim-level provenance in speaker notes: security and audit claims cite scope and evidence; economics cite definitions, source cells or formulas, assumptions, and as-of dates.
7. Include delivery plan, governance, security, evidence, commercials, and decision path.
8. Run manage-office-sources and audit-office-claims, then verify-powerpoint on the exact final saved deck.
9. Validate the evidence with validate_evidence_report.py --profile proposal and the exact slide target before assigning PASS.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-powerpoint](../verify-powerpoint/SKILL.md).


## Verification

- Give every slide one narrative job and one primary claim.
- Preserve masters, layouts, placeholders, notes, and native editability.
- Render every slide and run the slide show for motion, media, links, or triggers.
- Scope and exclusions are visible.
- Any hard slide target equals the reopened deck count under the agreed appendix and hidden-slide rule.
- Security and auditability claims match scoped evidence rather than generic compliance language.
- Commercial and economics claims expose definitions, source formulas, assumptions, and dates.
- The deck contains a concrete next decision.
- Unresolved provenance, a labeled skeleton, or a failed verifier blocks delivery.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
