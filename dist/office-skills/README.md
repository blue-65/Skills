# Office Skills

A deterministic, Office-workflow Agent Skills distribution for Microsoft Word,
PowerPoint, and Excel. It preserves MengTo/Skills as an upstream reference while
replacing web-runtime assumptions with editable Office contracts, source
protection, application readback, accessibility checks, and render-based gates.

## Library

- Common workflows: 12
- Word workflows: 14
- PowerPoint workflows: 22
- Excel workflows: 16
- Total active skills: 64

Start with [route-office-task](agent-skills/common/route-office-task/SKILL.md)
when the correct output format is unclear. Read [CATALOG.md](CATALOG.md) for the
complete list.

## Installation

Install the complete distribution root. If a compatible Agent Skills loader
copies only selected folders under `agent-skills`, it must also preserve
`references`, `scripts`, `DESIGN.md`, and their relative paths. Resolve
runtime commands from that installed distribution root, never from an assumed
caller working directory.

## Runtime boundary

The skills do not replace a Word, PowerPoint, or Excel content-authoring engine.
Use a host artifact runtime or Windows desktop Office. The included
`scripts/office_preflight.ps1`, `scripts/export_office.ps1`,
`scripts/scan_office.py`, and `scripts/validate_evidence_report.py` provide
capability detection, application-backed export, deterministic static scanning,
and profile-aware evidence validation. They do not prove visual quality,
calculation, animation, or form behavior without the actual Office application.
Install the pinned Draft 2020-12 validator with
`python -m pip install -r scripts/requirements-validation.txt`; if it is
unavailable, evidence validation returns `INCONCLUSIVE`, never `PASS`.

## Production contract

Every create or edit workflow must preserve the source, save and reopen the
final artifact, run a format-specific issue scan, render every page, slide, or
used worksheet, and inspect the render. A skipped required gate is
`INCONCLUSIVE`, not `PASS`.

## Provenance

See [UPSTREAM.md](UPSTREAM.md) and [SOURCE_MAP.json](SOURCE_MAP.json). The
upstream MIT license is retained in [LICENSE](LICENSE).
