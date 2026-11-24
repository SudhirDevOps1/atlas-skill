# atlas-skill

Personal, private collection: one master prompt + one portable agent skill that turn
"build me this" into a researched, secure, tested, documented, deployable project —
with a single source of truth for versioning.

## Contents

| Path | What it is |
|---|---|
| `ATLAS-MASTER-PROMPT.md` | The full rulebook. One paste into any capable model. 34 sections + appendix. |
| `atlas-project-architect/` | The portable skill. `SKILL.md` (147 lines) + `references/` + `assets/templates/` + `scripts/version.mjs`. |

## Install the skill

```powershell
# OpenCode, global
Copy-Item -Recurse .\atlas-project-architect "$env:USERPROFILE\.config\opencode\skills\"

# OpenCode, one project only
Copy-Item -Recurse .\atlas-project-architect .\.opencode\skills\
```

```bash
# Claude Code
cp -r atlas-project-architect ~/.claude/skills/

# Cursor / Windsurf
# .cursor/rules/atlas.mdc  ->  @atlas-project-architect/SKILL.md
```

Chat UIs (ChatGPT, Gemini, Claude web): paste `SKILL.md` as the first message, or
paste `ATLAS-MASTER-PROMPT.md` when you want the complete rulebook in one go.

## Version tool

`atlas-project-architect/scripts/version.mjs` is dependency-free (Node 18+), transactional,
BOM-safe and idempotent. Copy it into a project's `scripts/` folder:

```json
{
  "scripts": {
    "version:bump": "node scripts/version.mjs bump",
    "version:set": "node scripts/version.mjs set",
    "version:sync": "node scripts/version.mjs sync",
    "version:verify": "node scripts/version.mjs verify"
  }
}
```

```bash
pnpm run version:bump patch      # 0.1.0 -> 0.1.1
pnpm run version:bump alpha      # 0.1.0 -> 0.2.0-alpha.1
pnpm run version:set 0.2.0-beta.0
pnpm run version:sync            # regenerate every derived surface
pnpm run version:verify          # CI gate, exit 1 on drift
```

`package.json#version` (or root `version.json`) is the only hand-edited version.
Everything else — app constant, `public/version.json`, README badge, changelog, docs
front-matter, `index.html` meta, OpenAPI, Android `versionName`/`versionCode`, Tauri,
Expo, Docker label, MEMORY/HANDOFF/status — is generated.

Full contract: `atlas-project-architect/references/07-versioning-ssot.md`.

## Status

- `version.mjs` — tested end to end (bump/set/sync/verify/show, dry-run, drift detection,
  rollback on write failure, BOM preservation, both SSOT modes).
- Skill behaviour — prompt-level; no automated eval suite has been run.

Personal use. Not a published package.
