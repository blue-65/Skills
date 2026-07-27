# Excel production reference

Use this reference for `.xlsx`, `.xls`, `.csv`, and `.tsv` work whose final
editable artifact is an Excel workbook. The user request and supplied workbook
take precedence; `office-output-contract.md` remains the delivery floor.

## Route and protect the source

- Existing workbook: inspect sheets, used ranges, formulas, names, tables,
  charts, validation, conditional formatting, print settings, hidden content,
  protection, queries, connections, macros, and calculation mode before editing.
- New workbook: define inputs, source data, transformations, calculations,
  checks, and outputs before styling.
- Preserve the only source copy. Keep raw imports unchanged and build explicit
  cleaned or mapped layers.
- Do not use CSV as the final format when the deliverable requires formulas,
  types, multiple sheets, formatting, comments, validation, or charts.
- When desktop Excel is available, reuse the open workbook whose absolute
  `FullName` matches the target. Keep user work open unless a closed batch run
  was explicitly requested.

## Workbook architecture and types

- Give every used sheet a brief, unique name and remove unused blank sheets.
- Put a plain-language title or usage note in or near `A1`.
- Separate inputs, source data, transformations, calculations, checks, outputs,
  and controls into clear ranges or sheets. Distinguish them by structure first
  and color second.
- Store numbers, dates, percentages, currency, and Boolean values as typed
  values with explicit number formats. Keep identifiers with meaningful leading
  zeros as text.
- Use Excel Tables, descriptive names, filters, freeze panes, validation, and
  conditional formatting when they improve operation or auditability.
- Do not merge cells in data or calculation areas.

## Formula and calculation rules

- Make derived outputs formulas, not hardcoded values. Put material assumptions
  in visible labeled cells rather than as constants inside formulas.
- Prefer simple formulas and helper columns to opaque expressions. Use
  consistent patterns, correct relative and absolute references, structured
  references, and quoted cross-sheet references.
- When writing through automation, use invariant formula syntax and English
  function names unless the target API explicitly requires localized formulas.
- Test blank, zero, negative, missing, duplicate, and boundary cases.
- Trace representative outputs to source inputs and independently reconcile
  critical totals.

## Tables, charts, and publication

- Set widths and row behavior deliberately. Do not leave clipped labels, hidden
  values, or visible `###`.
- Use charts only for a real comparison, trend, distribution, relationship,
  range, or exception. Verify source ranges, category labels, series names,
  units, axes, periods, and as-of dates.
- Keep dashboard source data and calculations visible on supporting sheets.
- Do not use color as the only status or series identifier.
- Define print areas for published sheets. Use width-to-one-page scaling only
  when it stays readable; never compress a long sheet to one illegible page.

## Accessibility floor

Follow Microsoft's current
[Excel accessibility best practices](https://support.microsoft.com/en-US/accessibility/excel/accessibility-best-practices-with-excel-spreadsheets)
and [Accessibility Checker rules](https://support.microsoft.com/en-US/accessibility/office-accessibility/rules-for-the-accessibility-checker).

- Check unique sheet names, useful text at `A1`, descriptive table and range
  names, header rows, simple table structure, meaningful links, contrast, and
  alt text for charts and other informative visuals.
- Avoid unexplained blank rows or columns inside data tables and avoid merged,
  split, or nested table structures.
- Pair color with text, labels, symbols, or patterns.
- Run the Excel Accessibility Checker when available, then inspect manually
  because it does not prove formula correctness, print layout, or runtime
  behavior.

## Save and verification gates

All required gates must pass in the final saved artifact.

1. **Save integrity.** Save a new workbook with
   `SaveAs(<absolute path>, FileFormat=51)` and use `Save()` for subsequent
   writes. Confirm the file exists and is non-empty, then reopen or reattach to
   that exact file. Read back `FullName`, sheet names, used ranges, tables,
   names, formula counts, charts, print areas, links, and calculation mode.
2. **Recalculation and readback.** Set automatic calculation, run a full
   calculation in Excel, save again, and read representative formulas and
   displayed values from inputs through final outputs. Reconcile critical totals
   independently.
3. **Structural scan.** Scan all used ranges for `#REF!`, `#DIV/0!`, `#VALUE!`,
   `#NAME?`, `#N/A`, circular references, unresolved placeholders, inconsistent
   formula patterns, unexplained hardcoded outputs, broken names, invalid chart
   sources, excessive used ranges, and unexpected loss of validation,
   protection, links, or connections. A clean scan ends with `PASS` and exit
   code `0`; defects use `[tag] location: explanation` and a non-zero exit code.
4. **Visual inspection.** Render every used worksheet. For published sheets,
   render every page of the intended print area. Inspect for clipped labels,
   hidden values, `###`, broken charts, blank trailing pages, bad page breaks,
   unreadable scaling, weak hierarchy, and inconsistent formatting.
5. **Runtime inspection.** In the final reopened workbook, test required
   validation, filters, freeze panes, PivotTables, slicers, controls, links,
   approved macros, queries, refreshes, and external connections in Excel.
   Static package inspection cannot prove these behaviors.

Any required gate reported as `SKIP` maps to `INCONCLUSIVE`, never `PASS`, and
stops delivery. This includes a skipped calculation, scan, used-sheet render,
accessibility check required by the brief, or runtime test. After a repair,
rerun the affected automated gate, full calculation when formulas may be
affected, and the complete used-sheet render. Allow at most three repair cycles;
if the third does not converge, stop and report the remaining defects, attempted
fixes, and likely cause.
