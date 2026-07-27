# PowerPoint production reference

Use this reference for `.pptx` creation and editing. The user request, supplied
deck, template, or master takes precedence; `office-output-contract.md` remains
the delivery floor.

## Establish the authority and story

Choose one visual authority:

1. A supplied deck or template controls masters, layouts, placeholders, theme,
   and inherited elements.
2. An explicit visual direction controls a new composition.
3. Without either, use the repository `DESIGN.md` and a small, coherent layout
   family.

Do not mix unrelated template systems.

- Define the audience, delivery setting, decision, and one communication job for
  the deck before making slides.
- Give each slide one narrative job and one primary claim. Use a unique takeaway
  title that states the point.
- Open with context, stakes, or the governing question and close with the
  decision, implication, action, or resolved answer.
- Move useful detail that does not change the live decision to speaker notes or
  an appendix.
- Put source provenance for external claims and assets in speaker notes or the
  project's approved citation surface. Include enough detail to identify the
  source, as-of date, URL, and asset license or permission.

## Masters, layouts, and composition

- Default to 16:9 unless the template or channel requires another size.
- Preserve the source master hierarchy. Put repeated identity, page furniture,
  and placeholders on masters or layouts rather than copying them slide by
  slide.
- Use title placeholders and stable layouts so slides remain editable,
  navigable, and resettable.
- Use at least 50 pt for the deck title, 35 pt for slide titles, 24 pt for
  subheads, and 16 pt for body text without a governing template. Prefer 18 to
  22 pt for body copy. Shorten copy or change composition before shrinking type.
- Use deliberate margins, a stable grid, and one clear composition per slide.
  Avoid nested cards, decorative pills, fake navigation, and dense dashboard
  styling unless the content is an interface.
- Use native text, shapes, charts, tables, and connectors when editability
  matters. Do not use full-slide screenshots as a substitute for construction.
- Route connectors behind nodes and around labels. Keep each diagram focused on
  one explainable relationship.

## Evidence, charts, and media

- Verify chart ranges, labels, units, periods, sample sizes, axes, and as-of
  dates. Keep the source data editable or traceable to a workbook.
- Verify image crop, resolution, subject position, brand accuracy, and license.
- Use motion only to clarify sequence, state, comparison, or causality.
- Every slide must still communicate as a static image and in PDF. Provide a
  labeled recording, frame sequence, or static explanation for web-only,
  3D-dependent, or interaction-dependent behavior that cannot survive export.
- Never claim that Morph, animation, triggers, links, audio, video, 3D, or
  embedded media works until it has run in the final slide show.

## Accessibility floor

Follow Microsoft's current guidance for
[slide titles](https://support.microsoft.com/en-us/powerpoint/title-a-slide),
[reading order](https://support.microsoft.com/en-US/PowerPoint/make-slides-easier-to-read-by-using-the-reading-order-pane),
and the [Accessibility Checker](https://support.microsoft.com/en-US/accessibility/office-accessibility/rules-for-the-accessibility-checker).

- Give every slide a unique semantic title, including an off-slide title when a
  visible title is intentionally omitted.
- Set a logical reading order for every object. Group only when it improves the
  reading unit and does not break required animation.
- Add meaningful alt text to informative non-text objects, review generated alt
  text, and mark decorative objects accordingly.
- Check contrast, meaningful links, captions or transcripts for media, and any
  information conveyed by color alone.

## Save and verification gates

All required gates must pass in the final saved artifact.

1. **Save integrity.** Save a new deck with
   `SaveAs(<absolute path>, 24)` and use `Save()` for subsequent writes. Confirm
   the file exists and is non-empty, then reopen or reattach to that exact file.
   Read back `FullName`, final slide count, size, masters, layouts, placeholders,
   notes, comments, links, transitions, and media inventory.
2. **Structural scan.** Scan for unresolved placeholders, blank or duplicate
   slides, missing or duplicate titles, canvas overflow, text overflow,
   unintended overlap, stale placeholders, broken connectors, missing notes
   sources, low contrast, and inaccessible reading order or alt text. A clean
   scan ends with `PASS` and exit code `0`; defects use
   `[tag] location: explanation` and a non-zero exit code.
3. **Visual inspection.** Render every slide individually and inspect each at
   full reading size. Inspect a montage for pacing, hierarchy, repeated
   silhouettes, margins, and page-furniture consistency. Also inspect the PDF or
   static export to confirm the fallback communicates every required point.
4. **Runtime inspection.** Run the complete final slide show on the target
   PowerPoint version for Morph, animation, triggers, links, audio, video, 3D,
   embedded objects, and presenter-flow dependencies.

Any required gate reported as `SKIP` maps to `INCONCLUSIVE`, never `PASS`, and
stops delivery. This includes a skipped scan, slide render, accessibility check
required by the brief, static fallback check, or runtime test. After a repair,
rerun the affected automated gate and the complete slide render and montage.
Allow at most three repair cycles; if the third does not converge, stop and
report the remaining defects, attempted fixes, and likely cause.
