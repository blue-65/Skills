# Office tool routing

Select tools by the artifact's current state and the verification evidence
required.

## Capability preflight

This repository provides workflow contracts and bounded validation adapters. It
does not bundle a general Word, PowerPoint, or Excel authoring engine.

Before any create or edit operation:

1. Identify the host artifact runtime or installed desktop Office application
   that will author native content.
2. On Windows, run the included COM preflight described in
   [execution runtime](execution-runtime.md).
3. Record whether authoring, reopening, recalculation, slideshow execution,
   export, and visual inspection are available.
4. If the required authoring or rendering capability is absent, stop at a
   clearly labeled plan or skeleton. Report `INCONCLUSIVE`; do not imply that a
   native Office artifact was created or verified.

## Existing live Office artifact

Use visible desktop Office automation when it is available and the task depends
on native fidelity or application behavior.

- Attach to the running application.
- Reuse an already-open file with the same absolute path.
- Keep the application visible and do not close user work.
- Save before any external process reads the file.
- Test runtime-only features in the actual application.

## New local artifact

Use the installed document, presentation, or spreadsheet artifact runtime.

- Use the dependency paths provided by the host environment.
- Name the selected runtime and record its version or capability result in the
  verification evidence.
- Work in a writable temporary or project directory.
- Keep one auditable builder per artifact when code generation is required.
- Export to the user's requested native Office format.
- Render and inspect the final output.
- Run the included static scanner after the final save. Treat it as structural
  evidence only, then complete application-backed and visual gates.

## Static inspection

ZIP, OOXML, text extraction, and formula inspection can verify structure but not
final appearance or application behavior.

Static inspection is useful for:

- required package parts and relationship targets;
- comments, tracked changes, fields, notes, formulas, names, and metadata;
- placeholder and error scans;
- comparing source and candidate structure.

It cannot prove:

- final Word pagination;
- PowerPoint animation, Morph, media, or triggers;
- Excel calculation in the target application;
- form and control interaction;
- visual quality.

Label results as `verified`, `partially verified`, or `INCONCLUSIVE` according
to the strongest evidence actually obtained.
