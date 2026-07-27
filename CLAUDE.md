# Claude Code repository adapter

Read and follow:

1. `AGENTS.md`
2. `DESIGN.md`
3. `references/office-output-contract.md`
4. The narrowest matching
   `dist/office-skills/agent-skills/<category>/<skill>/SKILL.md`

Do not assume web, game, or HTML demo behavior from the upstream repository.
This fork targets native, editable, and verified Word, PowerPoint, and Excel
artifacts. Do not hand-edit generated files under `dist/office-skills`; update
`scripts/skill-catalog.mjs` or a shared reference and rebuild.
