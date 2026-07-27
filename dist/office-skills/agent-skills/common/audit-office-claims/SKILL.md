---
name: "audit-office-claims"
description: "Audit factual claims, numbers, comparisons, and citations in Office deliverables. Use before sending proposals, reports, executive decks, financial models, dashboards, or any document containing externally verifiable assertions."
---

# Audit Office claims

## Outcome

Separate verified facts, calculations, assumptions, recommendations, and unsupported statements, then correct or qualify each risky claim.

## Required context

- Read [the Office output contract](../../../references/office-output-contract.md) before acting.
- Read [the repository design contract](../../../DESIGN.md) before making visual decisions.
- If the target project has its own `DESIGN.md` or a supplied template, apply it before this repository default.
- Apply this precedence: user request, supplied template or source, project design system, this skill, repository defaults.

## Runtime boundary

- This skill supplies a workflow contract, not a bundled content-authoring engine.
- Select a host-provided Office artifact runtime or run the included Windows COM preflight described in [execution runtime](../../../references/execution-runtime.md) before editing.
- Resolve included scripts from the installed distribution root that contains `agent-skills`, `references`, and `scripts`; do not assume the caller's current working directory.
- Use the included static scanner for package evidence, while recognizing that static inspection cannot prove layout, calculation, or application behavior.
- If no compatible authoring and rendering runtime is available, stop after a clearly labeled plan or skeleton and report the artifact as `INCONCLUSIVE`.

## Workflow

1. Extract material claims and numbers from the final saved artifact.
2. Trace each claim to a source, formula, or clearly labeled assumption.
3. Check dates, units, denominators, definitions, sample sizes, and comparison periods.
4. Recalculate derived numbers independently or from auditable workbook formulas.
5. Replace vague superlatives and unsupported compliance language with precise evidence.
6. Record the remaining verification state without overstating certainty.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- No derived number is presented as a sourced raw fact.
- No source supports a different time period or definition than the claim.
- Unverified items are visible to the author and not disguised as confirmed.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
