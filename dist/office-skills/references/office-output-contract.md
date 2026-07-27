# Office Output Contract

Use this contract whenever a skill in this repository produces or revises a
Microsoft Office deliverable. The skill-specific Office adaptation defines the
communication job. This contract defines the production and verification floor.

Use [tool routing](tool-routing.md) to choose live Office automation, local
artifact generation, or static inspection. Use the
[Korean business reference](korean-business-documents.md) whenever Korean is the
primary working or delivery language. Record final gate evidence using
[the verification evidence contract](verification-evidence.md).

## Precedence

Apply requirements in this order:

1. The user's current request and delivery format.
2. A supplied source file, template, master, or workbook convention.
3. The target project's design system, including `DESIGN.md` when present.
4. The skill-specific Office adaptation.
5. The portable defaults in this contract.

When requirements conflict, preserve the higher-priority source and record the
deviation. Never silently restyle an existing document.

## Route the deliverable before drafting

Choose the smallest format set that completes the communication job.

| Need | Primary format | Use it for |
|---|---|---|
| Read, explain, approve, sign, or retain a narrative | Word `.docx` | Memos, proposals, reports, SOPs, policies, briefs, forms |
| Present, persuade, teach, or facilitate a live decision | PowerPoint `.pptx` | Pitches, reviews, training, walkthroughs, executive decisions |
| Calculate, compare, filter, update, or audit structured data | Excel `.xlsx` | Models, trackers, registers, scorecards, test matrices, dashboards |

Use a multi-file package only when each file has a distinct job. Do not copy the
same dense content into all three formats.

Before drafting, write this sentence in the working notes:

> By the end, **[audience]** should **[understand, decide, approve, or do]**
> because **[central evidence or conclusion]**.

## Universal workflow

1. Inspect the request, source files, templates, citations, and current document
   state before changing anything.
2. Write an acceptance brief covering artifact count and format, exact page,
   slide, or period targets, required source inputs, runtime needs, and delivery
   gates.
3. If a missing input would materially affect compliance, calculation,
   provenance, or a requested comparison, ask for it or produce only a clearly
   labeled skeleton. Never fabricate the missing source, baseline, requirement,
   customer evidence, or financial assumption.
4. Preserve source files. Create a working copy unless the user explicitly asks
   for an in-place edit.
5. Separate facts, assumptions, calculations, and recommendations. Mark
   unsupported claims as `unverified`.
6. Select Word, PowerPoint, Excel, or a deliberate package using the routing
   table above.
7. Define the information model before styling: headings and sections for Word,
   narrative claims and slide sequence for PowerPoint, and inputs, calculations,
   outputs, and controls for Excel.
8. Implement with native, editable Office structures. Use pictures only for
   content that cannot reasonably remain editable.
9. Add source provenance, accessibility metadata, and review state.
10. Save, reopen, calculate or refresh where relevant, render every page, slide,
   or used worksheet, and inspect the rendered result.
11. Deliver only the requested final files. Keep temporary renders, extracts, and
   build files out of the handoff unless the user asks for them.

## Source protection and safety

- Never overwrite the only copy of a source document.
- Keep tracked changes, comments, formulas, links, macros, external connections,
  and embedded media intact unless the request authorizes changing them.
- Do not add VBA, macros, ActiveX, external data connections, or executable
  content without explicit approval.
- Do not claim that a visual, formula, link, animation, or embedded object works
  until it has been checked in the final saved file.
- Remove private metadata only when requested or required by the delivery
  policy; report that removal because it is a material change.
- Use `verified`, `partially verified`, and `unverified` as explicit states.
  Static inspection is not application-level verification.

## Portable visual system

An existing template or project design system always wins. Without one, use a
restrained, Office-safe system derived from the repository's design contract:

| Role | Value |
|---|---|
| Canvas | `#F5F5F5` or white, selected by the document's use |
| Surface | `#FFFFFF` |
| Primary text | `#101828` |
| Secondary text | `#4A5565` |
| Border | `#E5E7EB` |
| Action or decision accent | `#124EEB` |
| Dark emphasis surface | `#1F1F1F` |

- Use one saturated accent. Color must communicate state or emphasis, not fill
  space.
- Use Aptos, Arial, or another broadly available sans serif as the portable
  default. Use a project font only when availability or embedding is verified.
- Follow an 8-point spacing rhythm where the format permits it.
- Prefer flat composition, strong alignment, and readable hierarchy.
- Avoid decorative gradients, glass effects, tiny uppercase labels, excessive
  rounded containers, repeated card grids, and visual effects that disappear in
  print or PDF.
- For Korean documents, verify CJK glyph coverage and line breaking. Prefer
  Aptos, Arial, or Malgun Gothic when the project font lacks Korean glyphs.

## Word contract

### Structure

- Choose the document archetype before drafting: memo, proposal, report, SOP,
  policy, manual, form, or reference guide.
- Use real Word styles for Title, Subtitle, Heading 1, Heading 2, Heading 3,
  Normal, captions, and lists. Keep heading levels in logical order.
- Keep important meaning in the document body. Headers and footers may repeat
  identity or navigation, but must not contain the only copy of critical
  information.
- Use real numbered and bulleted lists. Do not type fake markers into prose.
- Use tables only for genuinely comparable row-and-column data. Avoid nested
  tables, merged data cells, fixed row heights, and prose packed into grids.
- Add captions and cross-references for figures and tables when the document
  relies on them.

### Editing

- Preserve the original structure and formatting unless a broader rewrite is
  requested.
- Prefer local edits, tracked changes, and anchored comments over rewriting
  unrelated passages.
- Keep a clean delivery copy separate from a redline or review copy when both
  are required.

### Verification

- Reopen the saved `.docx`.
- Inspect headings, numbering, tables, links, fields, comments, tracked changes,
  headers, footers, and page breaks.
- Render every page and inspect it at normal reading size for clipping, orphaned
  headings, broken tables, missing glyphs, excessive blank space, and unstable
  pagination.
- Run the Office Accessibility Checker when the target environment permits it.
  Check alt text, meaningful links, contrast, and table headers.

## PowerPoint contract

### Narrative

- Give the deck one communication job and a cumulative narrative arc.
- Give every slide one narrative job and one primary claim.
- Use takeaway titles that state the point. An agenda is not a story.
- Open with the context, question, or stakes and close with the decision,
  implication, action, or resolved answer.
- Keep speaker-facing instructions and production notes out of visible slide
  content unless the audience needs them.

### Composition

- Default to 16:9 unless a template or delivery channel requires another size.
- Without a template, use at least 50 pt for the deck title, 35 pt for slide
  titles, 24 pt for subheads, and 16 pt for body text.
- Shorten copy or change layout before shrinking text.
- Use a slide master and layouts for repeated elements. Do not flatten a source
  deck or replace its master hierarchy without authorization.
- Prefer one clear composition over collections of cards, badges, pills, or
  interface-like panels.
- Use native shapes, text, charts, and tables when editability matters.
- Put external claim and asset sources in speaker notes or the project's
  approved citation surface.

### Motion and rich media

- Motion must clarify sequence, state, comparison, or causality.
- The slide must remain understandable as a static image and in exported PDF.
- Translate web motion into a short storyboard, Morph, entrance, emphasis, exit,
  or video only when the delivery setting supports it.
- Never represent WebGL, shaders, hover, cursor, scroll, or runtime interaction
  as a native Office capability. Use a labeled recording, frame sequence, or
  static equivalent and retain an editable explanation.

### Verification

- Reopen the final `.pptx` and run the slide show when motion is used.
- Render and inspect every slide individually, then inspect a montage for pacing
  and consistency.
- Fix unintended overlap, clipping, title wrapping, broken connectors, stale
  placeholders, blurry assets, and inconsistent page furniture.
- Verify object reading order, alt text, color contrast, and decorative-object
  markings when the target environment permits it.
- Confirm the PDF or static export still communicates every required point.

## Excel contract

### Workbook architecture

- Use descriptive worksheet names and remove unused blank worksheets.
- Put a plain-language title or usage note in or near cell `A1`.
- Separate inputs, source data, transformations, calculations, checks, and
  outputs into clear ranges or sheets.
- Keep formulas visible and auditable. Put assumptions in cells, not as magic
  numbers inside formulas.
- Use consistent formula patterns, correct absolute and relative references,
  and quoted cross-sheet references such as `='Assumptions'!B5`.
- Store numbers, dates, percentages, and currency as typed values with explicit
  number formats, not as formatted text.
- Use Excel Tables, named ranges, filters, freeze panes, validation, and
  conditional formatting when they improve operation or auditability.
- Do not merge cells in data or calculation areas.

### Analysis and presentation

- Show the important result near the top or on a dedicated output sheet.
- Use charts only when they reveal a comparison, trend, distribution,
  relationship, or exception more clearly than the table.
- Do not use color as the only status signal. Pair it with text, symbols, or
  labels.
- Keep source URLs in a source column or cell comments. Record the as-of date and
  definition for material metrics.

### Verification

- Recalculate the workbook in the target application.
- Trace representative outputs back to inputs and source definitions.
- Scan used ranges for `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, `#N/A`,
  circular references, hardcoded outputs, and inconsistent formulas.
- Reconcile key totals independently.
- Render every used worksheet or its intended print area and inspect for clipped
  labels, hidden values, broken charts, excessive used ranges, and poor print
  scaling.
- Run the Office Accessibility Checker when possible. Check sheet names, cell
  `A1`, table headers, alt text, meaningful links, and contrast.

## Cross-format package rules

When more than one Office file is required:

- Establish one source of truth for every repeated fact or metric.
- Keep terminology, dates, units, and status labels identical across files.
- Let Excel own calculations, Word own long-form explanation, and PowerPoint own
  the live decision narrative.
- Reconcile all repeated headline metrics immediately before delivery.
- Use matching version identifiers and an as-of date in every file.

## KDL execution profile

When this repository is used inside KDL Vibe Work:

- Treat local `vw-docx`, `vw-xlsx`, and `vw-pptx` assets as optional execution
  adapters, not bundled dependencies. Confirm that their documented commands,
  render dimensions, dependency paths, and validation behavior match the
  installed files before routing work through them.
- Use `office-com` for visible Word, Excel, and PowerPoint application control
  when that integration is available. Do not assume an `officecli.exe` binary.
- Preserve the KDL delivery gates: save integrity, issue scan, application
  reopen, and visual review.
- Treat live Office verification as stronger evidence than static OOXML
  inspection, and label the result when only static verification was possible.
- If an adapter preflight fails or its documentation conflicts with its
  implementation, use the portable contract in this repository and report the
  adapter as `unverified` instead of silently depending on it.

## Live Office execution contract

When desktop Office and COM automation are available:

- Attach to the already-running application and reuse an open document with the
  same absolute `FullName`. Open a new instance only when no compatible
  application is available.
- Keep Office visible while changing user-facing files. Batch COM calls inside
  one process and one logical script.
- Keep the application and document open after saving unless the user explicitly
  requests a closed batch workflow. Reveal the changed page, slide, or range at
  handoff.
- Use absolute paths and UTF-8 scripts and output. For SaveAs operations, use
  explicit format constants: DOCX `16`, XLSX `51`, PPTX `24`, Word PDF `17`,
  Excel PDF export `0`, and PowerPoint PDF `32`.
- Probe uncertain APIs on a disposable artifact before using them on the source.
  Never invent a COM member or silently substitute an unsupported feature.

## Delivery gates

Every create or edit workflow must pass all three gates:

1. **Save integrity.** Save, read back the absolute path, confirm the file exists
   and is non-empty, then reopen or reattach to the saved artifact. Update Word
   fields and TOC, recalculate Excel with automatic calculation and a full
   calculation, and read back the final PowerPoint slide count.
2. **Automated issue scan.** Scan placeholders and format-specific structural
   defects. A successful scan ends with `PASS` and exit code `0`; defects use
   `[tag] location: explanation` and a non-zero exit code.
3. **Visual inspection.** Render every Word page, every PowerPoint slide, and
   every used Excel sheet or intended print area. Inspect each render at normal
   reading size. Automated scanning never replaces visual inspection.

If a required scan or render is skipped, the result is `INCONCLUSIVE`, not
`PASS`, and delivery must stop. After a fix, rerun the affected automated gate
and the complete visual inspection. If three repair cycles do not converge,
report the remaining defects and stop instead of lowering the standard.

Static renders cannot prove PowerPoint animation, Morph, 3D behavior, Word form
interaction, or Excel controls. Test those features in the actual Office
application and record the runtime result separately.

## Completion report

Create a machine-readable evidence report that conforms to
[evidence-report.schema.json](evidence-report.schema.json), validate its
cross-field meaning with the applicable semantic profile, then summarize:

- final deliverable paths and formats;
- artifact hashes and the exact source or baseline hashes when comparison or
  redline work was requested;
- what was materially changed;
- what was rendered, recalculated, reopened, or checked;
- any unresolved limitation or `unverified` item;
- source and template provenance when research or external assets were used.
