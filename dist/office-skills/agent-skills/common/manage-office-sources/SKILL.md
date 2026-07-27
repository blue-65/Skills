---
name: "manage-office-sources"
description: "Collect and preserve provenance for claims, data, images, logos, and external assets used in Office documents. Use when research or external material informs a Word document, PowerPoint deck, or Excel workbook."
---

# Manage Office sources

## Outcome

Make every material external claim and asset traceable without exposing internal research notes to the audience.

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

1. Record canonical URLs, authors or organizations, titles, dates, page or table labels, and retrieval dates.
2. Separate claim sources, data sources, image licenses, and template provenance.
3. Place citations in the format-appropriate surface: Word notes or references, PowerPoint speaker notes, and Excel source cells or comments.
4. Preserve original units, definitions, sample sizes, and as-of dates.
5. Mark any claim that cannot be verified as unverified or remove it.
6. Keep a compact source ledger alongside the working artifact until delivery.


## Verification

- Preserve the source artifact unless the user explicitly authorizes replacement.
- Keep claims, calculations, assumptions, and recommendations distinguishable.
- Use native, editable Office structures whenever the final user needs to continue editing.
- Every non-trivial external claim has a traceable source.
- Every external visual has a license or usage basis.
- Citations point to the exact supporting page, section, or dataset when available.

## Failure boundaries

- Do not overwrite the only source copy.
- Do not add macros, ActiveX, executable content, or external data connections without explicit authorization.
- Do not claim a feature or visual state was verified when it was only inferred from text, XML, or code.
- Treat a skipped required scan, render, calculation, or runtime check as `INCONCLUSIVE`, not `PASS`.
- If three repair cycles do not converge, stop and report the remaining defects and attempted fixes.
