# Word production reference

Use this reference for `.docx` creation and editing. The user request, supplied
source, and template take precedence; the repository
`office-output-contract.md` still defines the delivery floor.

## Route and protect the source

- Existing document: inspect styles, sections, headers, footers, numbering,
  fields, TOC, tables, links, comments, revisions, controls, protection, and
  embedded content before editing.
- New document: choose the archetype and outline before styling.
- Preserve the only source copy. Work on a copy unless in-place editing is
  explicit, and never accept, reject, resolve, or delete review history without
  authority.
- Reuse template styles and sections. Record any intentional deviation instead
  of recreating the template with direct formatting.
- When desktop Word is available, reuse the open document whose absolute
  `FullName` matches the target. Keep user work open unless a closed batch run
  was explicitly requested.

## Build semantic Word structure

- Use real styles for Title, Subtitle, Normal, Heading 1 through Heading 3,
  captions, quotations, lists, and named exceptions. Keep heading levels in
  logical order.
- Use list and multilevel-list definitions linked to paragraph styles. Do not
  type bullets, numbering, indentation, or page numbers as literal text.
- Use section breaks only for real changes in page size, orientation, numbering,
  columns, headers, or footers.
- Use Word fields for live values such as `PAGE`, `NUMPAGES`, `TOC`, `SEQ`,
  `REF`, and `PAGEREF`. Build a TOC only from valid heading or outline-level
  sources, then update all fields and TOCs after pagination changes.
- Keep critical information in the document body. Headers and footers may
  repeat identity and navigation, but must not hold the only copy.
- Prefer paragraph spacing over blank paragraphs and local edits over
  document-wide restyling.

## Tables, figures, and review surfaces

- Use tables only for comparable row-and-column data. Prefer a simple grid with
  a marked header row, flexible widths, repeating headers, and no fixed row
  heights that can clip text.
- Avoid layout tables, nested tables, and merged or split data cells.
- Keep captions with figures and tables. Add meaningful alt text to informative
  visuals and mark purely decorative objects as decorative when Word supports
  it.
- Preserve anchored comments and tracked changes. If both are requested, create
  separate clean and review copies from the same approved content.
- Give each fillable content control a visible label and unique title or tag.
  Test tab order, entry, validation, protection, and reset behavior in Word;
  static rendering cannot verify form interaction.

## Portable page and type defaults

- Use A4 for Korean business documents and locale-appropriate A4 or Letter
  elsewhere, with margins near 25 mm or 1 inch unless the template differs.
- Use 24 to 28 pt for a simple first-page title, 14 to 18 pt for Heading 1,
  12 to 14 pt for Heading 2, 10.5 to 11 pt for body text, and at least 9 pt for
  captions and sources.
- Prefer an installed Office-safe family. Verify Korean glyph coverage and final
  font substitution in Word.

## Accessibility floor

Follow Microsoft's current
[Word accessibility guidance](https://support.microsoft.com/en-US/accessibility/word/make-your-word-documents-accessible-to-everyone-with-accessibility-assistant)
and [Accessibility Checker rules](https://support.microsoft.com/en-US/accessibility/office-accessibility/rules-for-the-accessibility-checker).

- Check logical headings and lists, meaningful link text, alt text, contrast,
  table header rows, and simple table structure.
- Do not use color, position, or formatting as the only carrier of meaning.
- Run the Word Accessibility Checker when available, then review the document
  visually because the checker does not prove pagination or catch every issue.

## Save and verification gates

All required gates must pass in the final saved artifact.

1. **Save integrity.** Save a new delivery copy with
   `SaveAs2(<absolute path>, FileFormat=16)` and use `Save()` for subsequent
   writes. Confirm the path exists and is non-empty, then reopen or reattach to
   that exact file. Read back `FullName`, section and page counts, headings,
   fields, TOCs, tables, comments, and revision counts.
2. **Structural scan.** Update fields and TOCs, save again, and scan for
   placeholders, fake headings or bullets, skipped heading levels, broken
   fields, missing page-number fields, malformed tables, consecutive blank
   paragraphs, empty sections, invalid links, and unexpected loss of comments
   or revisions. A clean scan ends with `PASS` and exit code `0`; defects use
   `[tag] location: explanation` and a non-zero exit code.
3. **Visual inspection.** Render every page through Word or an approved
   Word-backed renderer. Inspect every render at normal reading size for
   clipping, missing glyphs, orphaned headings, broken tables, unstable page
   breaks, header or footer errors, excessive blank space, and inconsistent
   pagination.
4. **Runtime inspection.** In the final reopened document, test every required
   content control, protected form, hyperlink, cross-reference, approved macro,
   or other interactive behavior. Record runtime evidence separately from
   structural and visual evidence.

Any required gate reported as `SKIP` maps to `INCONCLUSIVE`, never `PASS`, and
stops delivery. This includes a skipped scan, render, accessibility check
required by the brief, or runtime test.
After a repair, rerun the affected automated gate and the complete page render.
Allow at most three repair cycles; if the third does not converge, stop and
report the remaining defects, attempted fixes, and likely cause.
