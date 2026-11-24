# Install ATLAS in any agent

ATLAS is a folder of Markdown plus one Node script. Installing it means putting that
folder where your agent looks for skills. There is no package manager, no build step,
no account, and no dependency.

If your agent reads `SKILL.md`, ATLAS works. That includes Claude Code, Codex, Cursor,
Antigravity, OpenCode, GitHub Copilot, Gemini CLI, Cline, Windsurf, Roo, Kilo, Amp,
Warp, Zed, Droid, Qwen Code, Kiro, Continue and OpenHands.

---

## What you need

| Need | Why |
|---|---|
| An agent that supports `SKILL.md` | It reads the folder. Anything on the list above does. |
| Node 18+ | Only for `scripts/version.mjs` and the installer. The skill itself needs nothing. |
| Git | Only if you clone. A ZIP download works the same. |

Nothing else. No API key, no config file, no global install.

---

## Why GitHub

GitHub is the distribution channel, not a requirement.

- **The agent reads files from disk.** A chat message is not a file. GitHub gives you a
  stable, versioned copy of those files to put on disk.
- **Updates are one `git pull`.** A pasted prompt goes stale silently.
- **Releases are reproducible.** `v1.1.0` is a fixed snapshot, so two people can install
  the same thing.
- **No account needed.** The repository is public; clone or download the ZIP anonymously.

Alternatives that also work: download the ZIP from the releases page, copy the folder
from another machine, or vendor it into your own repo. GitHub is simply the least
friction.

---

## Method 1 — the installer (recommended)

```bash
git clone https://github.com/SudhirDevOps1/atlas-skill.git
cd atlas-skill

node scripts/install-skill.mjs --list                       # supported agents + paths
node scripts/install-skill.mjs --agent claude-code --scope global
node scripts/install-skill.mjs --agent cursor --scope project
node scripts/install-skill.mjs --dest .agents/skills        # any skills directory
```

It copies `atlas-project-architect/` into `<skills-dir>/atlas-project-architect/` and
writes nothing else. An existing copy is left alone unless you pass `--force`.
Add `--dry-run` to see the plan without touching the disk.

Windows, macOS and Linux all work — it is plain Node.

---

## Method 2 — copy by hand

Clone once, then copy the folder into the skills directory your agent reads.

```bash
# macOS / Linux — global
mkdir -p ~/.claude/skills
cp -R atlas-project-architect ~/.claude/skills/

# macOS / Linux — one project
mkdir -p .agents/skills
cp -R /path/to/atlas-skill/atlas-project-architect .agents/skills/
```

```powershell
# Windows — global
New-Item -ItemType Directory -Force "$env:USERPROFILE\.claude\skills" | Out-Null
Copy-Item -Recurse .\atlas-project-architect "$env:USERPROFILE\.claude\skills\"

# Windows — one project
New-Item -ItemType Directory -Force ".\.agents\skills" | Out-Null
Copy-Item -Recurse .\atlas-project-architect ".\.agents\skills\"
```

Keep the folder name `atlas-project-architect` — it matches `name:` in the front matter.

---

## Method 3 — chat UI, no filesystem

ChatGPT, Claude web, Gemini web and similar cannot read a folder. Paste the skill instead.

1. Open `atlas-project-architect/SKILL.md`.
2. Paste it as the first message or into custom instructions.
3. Paste a reference file only when the conversation reaches that phase.
4. Use `ATLAS-MASTER-PROMPT.md` instead when you want the whole rulebook in one paste.

This costs more context per turn and cannot run `scripts/version.mjs`. It is the
fallback, not the default.

---

## Where each agent looks

Project paths are relative to the repository root. Global paths are relative to your
home directory.

| Agent | Project | Global | Installer id |
|---|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` | `claude-code` |
| Codex | `.agents/skills/` | `~/.agents/skills/` | `codex` |
| Cursor | `.agents/skills/` | `~/.cursor/skills/` | `cursor` |
| Antigravity | `.agents/skills/` | `~/.gemini/config/skills/` | `antigravity` |
| OpenCode | `.agents/skills/` or `.opencode/skills/` | `~/.config/opencode/skills/` | `opencode` |
| GitHub Copilot | `.agents/skills/` | `~/.copilot/skills/` | `copilot` |
| Gemini CLI | `.agents/skills/` | `~/.gemini/skills/` | `gemini-cli` |
| Cline | `.agents/skills/` | `~/.agents/skills/` | `cline` |
| Windsurf | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` | `windsurf` |
| Roo Code | `.roo/skills/` | `~/.roo/skills/` | `roo` |
| Kilo Code | `.agents/skills/` | `~/.kilo/skills/` | `kilo` |
| Amp | `.agents/skills/` | `~/.config/agents/skills/` | `amp` |
| Warp | `.agents/skills/` | `~/.agents/skills/` | `warp` |
| Zed | `.agents/skills/` | `~/.agents/skills/` | `zed` |
| Droid | `.agents/skills/` | `~/.factory/skills/` | `droid` |
| Qwen Code | `.qwen/skills/` | `~/.qwen/skills/` | `qwen` |
| Kiro CLI | `.kiro/skills/` | `~/.kiro/skills/` | `kiro` |
| Continue | `.continue/skills/` | `~/.continue/skills/` | `continue` |
| OpenHands | `.openhands/skills/` | `~/.openhands/skills/` | `openhands` |
| Any other `SKILL.md` agent | `.agents/skills/` | `~/.config/agents/skills/` | `universal` |

The full 60+ agent matrix, with the upstream source for every path, is in
[`docs/AGENT-COMPATIBILITY.md`](docs/AGENT-COMPATIBILITY.md).

### Notes per agent

**Claude Code** — `~/.claude/skills/` is global; `.claude/skills/` is per-project and
should be committed. ATLAS uses no `allowed-tools`, no hooks and no `context: fork`, so
it behaves the same everywhere.

**Codex** — reads `.agents/skills/` and `~/.agents/skills/`. No extra config.

**Cursor** — reads `.agents/skills/` (project) and `~/.cursor/skills/` (global). The old
advice of pointing `.cursor/rules/*.mdc` at `SKILL.md` still works but loses the
on-demand reference loading. Prefer the skills directory.

**Antigravity** — `.agents/skills/` per project, `~/.gemini/config/skills/` globally.

**OpenCode** — native path is `.opencode/skills/` (project) or `~/.config/opencode/skills/`
(global); it also reads `.agents/skills/`. Either is fine.

**GitHub Copilot** — `.agents/skills/` per repo, `~/.copilot/skills/` globally.

**Windsurf** — `.windsurf/skills/` per project, `~/.codeium/windsurf/skills/` globally.

---

## Verify it worked

1. The file exists:

   ```bash
   ls ~/.claude/skills/atlas-project-architect/SKILL.md
   ```

2. Start a **new** session — agents scan the skills directory at startup, so an
   already-open session will not see it.

3. Ask the agent:

   ```text
   Which skills do you have available?
   ```

   `atlas-project-architect` should be listed with its description.

4. Trigger it without naming it:

   ```text
   ye app banao: ek link-in-bio page jisme analytics ho
   ```

   If it starts with questions, assumptions and a brief instead of code, it worked.

---

## What to give the AI

The skill is the process. The input is the project.

| You give | You get |
|---|---|
| The task only | A brief with assumptions it had to guess |
| Task + the six `PROJECT-INPUT.md` answers | A brief with far fewer guesses |
| Task + answers + `ATLAS-MASTER-PROMPT.md` | The full rulebook in context; highest token cost |
| Task + an existing repo | Brownfield audit first, then a plan |

The six answers that remove the most guessing:

```text
GOAL:            what the product must do
USERS:           who uses it, how many
PLATFORM:        web / mobile / desktop / CLI / API
DATA:            what is stored, where, how sensitive
BUDGET:          free only / a fixed monthly cap
DEADLINE:        now / this week / no deadline
```

Template: `atlas-project-architect/assets/templates/PROJECT-INPUT.md`.

Do not paste the reference files up front. The skill loads one phase at a time on
purpose — pasting all eleven costs 10–15× more context and makes the agent worse, not
better.

---

## Updating

```bash
cd atlas-skill
git pull
node scripts/install-skill.mjs --agent claude-code --scope global --force
```

`--force` replaces the installed copy. Without it the installer refuses, so a local edit
is never destroyed silently. Pin a version with `git checkout v1.1.0` before installing
if you need a fixed snapshot.

---

## Uninstalling

Delete the folder. Nothing else was written.

```bash
rm -rf ~/.claude/skills/atlas-project-architect
```

```powershell
Remove-Item -Recurse "$env:USERPROFILE\.claude\skills\atlas-project-architect"
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Skill never triggers | Session started before install | Restart the agent |
| Skill listed but ignored | Task too small (a snippet, a regex) | Expected — the skill stays out of the way |
| `SKILL.md not found` | Wrong nesting, e.g. `skills/atlas-project-architect/atlas-project-architect/` | The folder must sit directly under the skills directory |
| Agent cannot read references | Files copied without the subfolders | Copy the whole folder, not just `SKILL.md` |
| `node: command not found` | Node not installed | Install Node 18+; the skill still works without it, the version tool does not |
| Installer says "already exists" | A previous install | Add `--force` |
| Two copies, confusing behaviour | Both project and global installed | Keep one; project scope wins for that repo |

If a path in this document is wrong for your agent version, check the agent's own docs
first — those paths move. The matrix in `docs/AGENT-COMPATIBILITY.md` records the date
each path was verified.
