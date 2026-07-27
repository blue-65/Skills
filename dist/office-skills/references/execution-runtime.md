# Office execution runtime

These adapters provide a small, auditable execution floor for DOCX, PPTX, and
XLSX files. They do not replace application reopen, calculation, slideshow
testing, accessibility checks, or complete visual inspection.

## Result contract

Every normal invocation writes one JSON object to standard output and uses the
same process exit codes:

| Status | Exit code | Meaning |
|---|---:|---|
| `PASS` | `0` | Every check performed by that adapter completed successfully. |
| `REJECT` | `1` | The input, request, package, or export has a confirmed defect. |
| `INCONCLUSIVE` | `2` | The required runtime or adapter capability is unavailable, so success cannot be established. |

For a multi-file static scan, `REJECT` takes precedence over `INCONCLUSIVE`,
which takes precedence over `PASS`. JSON keys, issue ordering, and package-member
ordering are deterministic. Runtime timestamps are intentionally omitted. All
adapter JSON is ASCII-safe, so non-ASCII paths are emitted as JSON Unicode
escapes and round-trip without depending on the shell code page.

## Static OOXML issue scan

First resolve the installed distribution root. It is the directory containing
`agent-skills`, `references`, and `scripts`. Do not assume that the caller's
working directory is the distribution root.

```powershell
$officeSkillsRoot = (Resolve-Path "<installed-office-skills-root>").ProviderPath
$scanner = Join-Path $officeSkillsRoot "scripts\scan_office.py"
python $scanner <absolute-input> [<absolute-input> ...]
python $scanner <absolute-input> `
  --allow-external-target "https://example.org/reviewed-source"
python $scanner --self-test
```

The scanner uses only the Python standard library. It checks:

- ZIP integrity, unsafe or duplicate member names, required OOXML parts, and
  parseable XML;
- internal relationship targets and every relationship marked external;
- explicit placeholder tokens such as template braces, `TBD`, `TODO`,
  `FIXME`, Lorem Ipsum, and default click-to-add text;
- basic Word counts for paragraphs, tables, sections, comments, headers, and
  footers;
- basic PowerPoint counts for slides, notes, masters, layouts, charts, and
  media;
- basic Excel counts for worksheets, cells, formulas, names, tables, charts,
  and external-link parts;
- literal Excel formula errors such as `#REF!`, `#DIV/0!`, `#VALUE!`, and
  related modern error values.

An external relationship is rejected because static inspection cannot determine
whether it was authorized. After reviewing the final package and destination,
repeat `--allow-external-target` for each exact URI that is permitted. Broad
domains, prefixes, wildcards, and implicit trust are not accepted. The result
records total, authorized, and unauthorized external-relationship counts.

A clean static scan proves only the listed package checks. It does not prove
Word pagination, PowerPoint animation, Excel recalculation, link reachability,
accessibility, or visual quality.

## Office COM preflight

Resolve paths at runtime, then run:

```powershell
$input = (Resolve-Path "./samples/report.docx").ProviderPath
$outputRoot = (Resolve-Path "./artifacts").ProviderPath
$output = Join-Path $outputRoot "report.pdf"
$preflight = Join-Path $officeSkillsRoot "scripts\office_preflight.ps1"
powershell -NoProfile -File $preflight `
  -InputPath $input -OutputPath $output -Format PDF
```

Both paths must be absolute. The input must exist. The output parent must exist,
and the output itself must not exist. Preflight validates the format pair,
checks the Windows COM registration, and activates the required Office
application. It attaches to an existing application when possible. Otherwise it
creates a disposable probe and quits it only when the probe exposes no open
documents. It never closes an open document.

Missing Windows desktop Office, failed COM activation, or an unsupported export
pair returns `INCONCLUSIVE`; the adapter does not claim a runtime that it could
not activate.

## Safe export adapter

Use the same absolute-path and absent-output rules:

```powershell
$exporter = Join-Path $officeSkillsRoot "scripts\export_office.ps1"
powershell -NoProfile -File $exporter `
  -InputPath $input -OutputPath $output -Format PDF
```

Supported MVP routes are:

| Input | PDF output | PNG output |
|---|---|---|
| DOCX | Supported through Word | `INCONCLUSIVE` |
| PPTX | Supported through PowerPoint | Supported as a new output directory containing one PNG per slide |
| XLSX | Supported through Excel | `INCONCLUSIVE` |

For PNG export, `OutputPath` names a directory that must not already exist. For
PDF export, it names a new `.pdf` file. The adapter never overwrites an output or
the source.

The export adapter reuses a matching document that was already open and leaves
it open. Otherwise it opens the source read-only, closes only that script-opened
object, and quits only an isolated application instance that is safe to quit.
Partial output from a failed export is preserved and reported instead of being
silently deleted.

## Verification boundary

A `PASS` from `scan_office.py` is a static structural result. A `PASS` from
`office_preflight.ps1` proves that the requested COM route was available at
preflight time. A `PASS` from `export_office.ps1` proves that Office produced
non-empty output and that the adapter confirmed its expected file count.

Delivery still requires inspection of every exported page, slide, or intended
worksheet view. PowerPoint PNG export verifies only static slide frames.
Animation, Morph, media, controls, Word forms, and Excel calculation behavior
remain application-level checks.
