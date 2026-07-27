---
name: "build-rfp-compliance-matrix"
description: "Build an Excel RFP, RFI, RFQ, or compliance matrix. Use when requirements, owners, evidence, response status, gaps, and submission locations must be tracked across a procurement response."
---

# Build an RFP compliance matrix

## Outcome

Create a filterable requirement register that proves completeness and exposes ownership, evidence, risk, and exceptions.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- Read [the excel production reference](../../../references/excel-production.md) for format-specific requirements.
- Read [rfp response patterns](../../../references/rfp-response-patterns.md).
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Extract each atomic requirement with source section and exact wording.
2. Assign requirement type, mandatory status, owner, evidence, response location, and status.
3. Use controlled status values and validation lists.
4. Distinguish compliant, configurable, roadmap, partner-dependent, exception, and unanswered.
5. Add summary formulas without hiding the underlying rows.
6. Reconcile the final matrix to the submitted Word and PowerPoint files.

## Required companion workflows

- For external claims, metrics, or assets, use [manage-office-sources](../../common/manage-office-sources/SKILL.md) and [audit-office-claims](../../common/audit-office-claims/SKILL.md); unresolved evidence remains `unverified`.
- Before delivery, run [verify-excel-workbook](../verify-excel-workbook/SKILL.md).


## Verification

- Store typed values and make derived outputs formula-driven and auditable.
- Recalculate in the target application and trace representative outputs to inputs.
- Render every used sheet or intended print area after scanning formula errors.
- Every source requirement appears exactly once or has an explained split.
- Mandatory gaps are visible.
- Response locations resolve to real sections or slides.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
