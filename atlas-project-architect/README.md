# ATLAS Project Architect — portable skill

A process skill for any coding agent. It turns "build me this" into a researched, secure, tested, documented, deployable project — with a single source of truth for versioning.

```
atlas-project-architect/
├── SKILL.md                  # the skill (loaded when triggered)
├── references/               # phase detail, loaded on demand
├── assets/templates/         # AGENTS.md, MEMORY.md, HANDOFF.md, ...
└── scripts/version.mjs       # working SSOT version tool
```

## Install

### OpenCode
```bash
# project-scoped
mkdir -p .opencode/skills
cp -r atlas-project-architect .opencode/skills/

# or global
cp -r atlas-project-architect ~/.config/opencode/skills/
```

### Claude Code
```bash
mkdir -p ~/.claude/skills
cp -r atlas-project-architect ~/.claude/skills/
```

### Cursor / Windsurf / other agents
Point the agent's rules file at `SKILL.md` (e.g. `.cursor/rules/atlas.mdc` containing `@atlas-project-architect/SKILL.md`), or paste `SKILL.md` into the system prompt. References stay on disk and are read when needed.

### Any chat UI (ChatGPT, Gemini, Claude web)
Paste the contents of `SKILL.md` as the first message / custom instruction. Add a reference file only when the conversation reaches that phase.

### With the master prompt
This skill is the operational core. The full `ATLAS-MASTER-PROMPT.md` is the expanded version — use it when you want the complete rulebook in one paste; use the skill when you want lower context cost and on-demand loading.

## Version tool

Copy `scripts/version.mjs` into the target project's `scripts/` folder and add:

```json
{
  "scripts": {
    "version:bump": "node scripts/version.mjs bump",
    "version:set":  "node scripts/version.mjs set",
    "version:sync": "node scripts/version.mjs sync",
    "version:verify": "node scripts/version.mjs verify"
  }
}
```

Then:

```bash
pnpm run version:bump patch
pnpm run version:sync
pnpm run version:verify
```

It is dependency-free (Node 18+), atomic, idempotent, and skips surfaces the project doesn't have.

## Context cost

- Skill metadata: ~120 tokens, always present.
- `SKILL.md`: ~1.8k tokens, loaded when triggered.
- One reference: ~1–2k tokens, only when that phase is active.

That is roughly 10–15% of the cost of pasting the full master prompt on every turn.
