# Office design contract

This file defines the default visual system for Office artifacts created from
this repository. A user request, supplied template, or target project's design
system always takes precedence.

## Design intent

Create restrained, information-rich business artifacts. Typography, alignment,
spacing, evidence, and native editability carry the design. Color is scarce and
functional.

## Color tokens

| Role | Value | Use |
|---|---|---|
| Paper | `#FFFFFF` | Primary page, slide, and sheet surface |
| Vellum | `#F5F5F5` | Secondary surface and quiet section separation |
| Slate 900 | `#101828` | Titles and primary text |
| Slate 700 | `#364153` | Secondary headings |
| Slate 600 | `#4A5565` | Body and supporting text |
| Frost | `#E5E7EB` | Rules, borders, and table structure |
| Carbon | `#1F1F1F` | Deliberate dark emphasis surface |
| Cobalt | `#124EEB` | Decisions, selected state, key action, or controlled input |

Use Cobalt as the only saturated accent by default. Do not use it as decorative
fill. Do not introduce gradients unless an explicit user or template requirement
overrides this contract.

## Typography

- Preferred project display family: Telegraf when installed and licensed.
- Portable Latin fallback: Aptos, Arial, Inter, or another installed sans serif.
- Korean fallback: approved project font, Pretendard, or Malgun Gothic.
- Verify glyph coverage and substitution in the final Office application.
- Use weights 300 to 600 for most hierarchy. Reserve 700 for rare emphasis.
- Never sacrifice readability for a thin weight.

## Word

- Page: A4 for Korean business documents; otherwise locale-appropriate A4 or
  Letter.
- General margins: approximately 25 mm or 1 inch.
- Title: 24 to 28 pt.
- Heading 1: 14 to 18 pt.
- Heading 2: 12 to 14 pt.
- Body: 10.5 to 11 pt with comfortable line spacing.
- Caption and source text: at least 9 pt.
- Use real styles, paragraph spacing, restrained rules, and tables only for
  comparable records.

## PowerPoint

- Canvas: 16:9 by default.
- Deck title: at least 50 pt.
- Slide title: at least 35 pt.
- Subhead: at least 24 pt.
- Body: at least 16 pt, with 18 to 22 pt preferred.
- Use one composition and one primary claim per slide.
- Use equal left and right margins by default.
- Prefer flat native shapes, clear image frames, and restrained annotations.
- Avoid nested cards, UI-like panels, decorative pills, tiny uppercase labels,
  and repeated numbered section scaffolds.
- Shorten copy or change layout before shrinking type.

## Excel

- Default type: Aptos or Arial at 10 to 11 pt.
- Sheet title: 16 to 20 pt.
- Section header: 11 to 13 pt and semibold.
- Inputs, calculations, outputs, and controls must be distinguishable by
  structure first and color second.
- Use Cobalt or a light Cobalt tint only for functional input or selected state.
- Use explicit number formats and deliberate column widths.
- Avoid dark dashboard themes unless the user or template requires one.

## Spacing and shape

- Use an 8-point rhythm where the format supports it.
- Use 8 px or approximately 6 pt corner radius for the rare rounded shape.
- Prefer no container over an unnecessary container.
- Do not combine a border and a wide decorative shadow.
- Use one subtle elevation treatment at most.

## Imagery and charts

- Prefer product evidence, real workflows, diagrams, charts, screenshots, and
  official brand assets over generic lifestyle photography.
- Do not fabricate evidence through generated visuals.
- Verify license, crop, resolution, and source.
- Choose chart forms by the analytical relationship and use honest axes.
- Color is never the only status or series identifier.

## Banned defaults

- Gradient text.
- Decorative glassmorphism.
- Repeated identical card grids.
- Tiny uppercase eyebrow labels above every section.
- Numbered section markers when order carries no information.
- Full-page or full-slide raster screenshots used in place of editable content.
- Unreadable gray text, clipped content, or unexplained direct-formatting drift.
