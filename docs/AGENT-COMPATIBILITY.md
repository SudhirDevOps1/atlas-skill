# Agent compatibility

ATLAS follows the shared [Agent Skills specification](https://agentskills.io): a folder
containing `SKILL.md` with YAML front matter. Any agent that implements that spec can
load it.

**Verified:** 2026-11-24 against
[`vercel-labs/skills` → `docs/agents.md`](https://github.com/vercel-labs/skills/blob/HEAD/docs/agents.md)
and the [OpenCode skills docs](https://opencode.ai/docs/skills). Paths are copied from
those sources, not from memory. Agent vendors change them; if one disagrees with your
installed version, the vendor's docs win.

---

## What ATLAS actually uses

This is why it works almost everywhere:

| Spec feature | Used by ATLAS |
|---|---|
| `name` + `description` front matter | Yes — the only front matter |
| Body instructions | Yes |
| Relative file reads (`references/…`) | Yes |
| Bundled scripts | Yes — `scripts/version.mjs`, plain Node |
| `allowed-tools` | No |
| `context: fork` | No |
| Hooks | No |
| MCP servers | No |

It deliberately stays inside the common subset. A feature that only one agent supports
would make the skill behave differently on the others, and the whole point is one
process everywhere.

---

## Paths

Project paths are relative to the repository root; global paths to your home directory.

| Agent | `--agent` id | Project | Global |
|---|---|---|---|
| AiderDesk | `aider-desk` | `.aider-desk/skills/` | `~/.aider-desk/skills/` |
| Amp, Replit, Universal | `amp`, `replit`, `universal` | `.agents/skills/` | `~/.config/agents/skills/` |
| Antigravity, Antigravity CLI | `antigravity` | `.agents/skills/` | `~/.gemini/config/skills/` |
| AstrBot | `astrbot` | `data/skills/` | `~/.astrbot/data/skills/` |
| Autohand Code CLI | `autohand-code` | `.autohand/skills/` | `~/.autohand/skills/` |
| Augment | `augment` | `.augment/skills/` | `~/.augment/skills/` |
| IBM Bob | `bob` | `.bob/skills/` | `~/.bob/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| OpenClaw | `openclaw` | `skills/` | `~/.openclaw/skills/` |
| Cline, Codex, Dexto, fx, Kimi Code CLI, Loaf, Pi, Sarvam Code, Warp, Zed | `cline`, `codex`, … | `.agents/skills/` | `~/.agents/skills/` |
| CodeArts Agent | `codearts-agent` | `.codeartsdoer/skills/` | `~/.codeartsdoer/skills/` |
| CodeBuddy | `codebuddy` | `.codebuddy/skills/` | `~/.codebuddy/skills/` |
| Codemaker | `codemaker` | `.codemaker/skills/` | `~/.codemaker/skills/` |
| Code Studio | `codestudio` | `.codestudio/skills/` | `~/.codestudio/skills/` |
| Command Code | `command-code` | `.commandcode/skills/` | `~/.commandcode/skills/` |
| Continue | `continue` | `.continue/skills/` | `~/.continue/skills/` |
| Cortex Code | `cortex` | `.cortex/skills/` | `~/.snowflake/cortex/skills/` |
| Crush | `crush` | `.crush/skills/` | `~/.config/crush/skills/` |
| Cursor | `cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| Deep Agents | `deepagents` | `.agents/skills/` | `~/.deepagents/agent/skills/` |
| Devin for Terminal | `devin` | `.devin/skills/` | `~/.config/devin/skills/` |
| Droid | `droid` | `.agents/skills/` | `~/.factory/skills/` |
| Eve | `eve` | `agent/skills/` | project only |
| Firebender | `firebender` | `.agents/skills/` | `~/.firebender/skills/` |
| ForgeCode | `forgecode` | `.forge/skills/` | `~/.forge/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| Goose | `goose` | `.goose/skills/` | `~/.config/goose/skills/` |
| Grok Build | `grok` | `.grok/skills/` | `~/.grok/skills/` |
| Hermes Agent | `hermes-agent` | `.hermes/skills/` | `~/.hermes/skills/` |
| inference.sh | `inference-sh` | `.inferencesh/skills/` | `~/.inferencesh/skills/` |
| Jazz | `jazz` | `.jazz/skills/` | `~/.jazz/skills/` |
| Junie | `junie` | `.junie/skills/` | `~/.junie/skills/` |
| iFlow CLI | `iflow-cli` | `.iflow/skills/` | `~/.iflow/skills/` |
| Kilo Code | `kilo` | `.agents/skills/` | `~/.kilo/skills/` |
| Kimchi | `kimchi` | `.kimchi/skills/` | `~/.config/kimchi/harness/skills/` |
| Kiro CLI | `kiro-cli` | `.kiro/skills/` | `~/.kiro/skills/` |
| Kode | `kode` | `.kode/skills/` | `~/.kode/skills/` |
| Lingma | `lingma` | `.lingma/skills/` | `~/.lingma/skills/` |
| MCPJam | `mcpjam` | `.mcpjam/skills/` | `~/.mcpjam/skills/` |
| MiniMax Code | `minimax-code` | `.minimax/skills/` | `~/.minimax/skills/` |
| Mistral Vibe | `mistral-vibe` | `.vibe/skills/` | `~/.vibe/skills/` |
| Moxby | `moxby` | `.moxby/skills/` | `~/.moxby/skills/` |
| Mux | `mux` | `.mux/skills/` | `~/.mux/skills/` |
| OpenCode | `opencode` | `.agents/skills/` or `.opencode/skills/` | `~/.config/opencode/skills/` |
| OpenHands | `openhands` | `.openhands/skills/` | `~/.openhands/skills/` |
| Ona | `ona` | `.ona/skills/` | `~/.ona/skills/` |
| Posit Assistant | `posit-assistant` | `.posit/assistant/skills/` | `~/.posit/assistant/skills/` |
| Qoder | `qoder` | `.qoder/skills/` | `~/.qoder/skills/` |
| Qoder CN | `qoder-cn` | `.qoder/skills/` | `~/.qoder-cn/skills/` |
| Qwen Code | `qwen-code` | `.qwen/skills/` | `~/.qwen/skills/` |
| Reasonix | `reasonix` | `.reasonix/skills/` | `~/.reasonix/skills/` |
| Rovo Dev | `rovodev` | `.rovodev/skills/` | `~/.rovodev/skills/` |
| Roo Code | `roo` | `.roo/skills/` | `~/.roo/skills/` |
| Tabnine CLI | `tabnine-cli` | `.tabnine/agent/skills/` | `~/.tabnine/agent/skills/` |
| Terramind | `terramind` | `.terramind/skills/` | `~/.terramind/skills/` |
| Tinycloud | `tinycloud` | `.tinycloud/skills/` | `~/.tinycloud/skills/` |
| Trae | `trae` | `.trae/skills/` | `~/.trae/skills/` |
| Trae CN | `trae-cn` | `.trae/skills/` | `~/.trae-cn/skills/` |
| Windsurf | `windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| ZCode | `zcode` | `.zcode/skills/` | `~/.zcode/skills/` |
| Zencoder, Zenflow | `zencoder`, `zenflow` | `.zencoder/skills/` | `~/.zencoder/skills/` |
| Neovate | `neovate` | `.neovate/skills/` | `~/.neovate/skills/` |
| Pochi | `pochi` | `.pochi/skills/` | `~/.pochi/skills/` |
| PromptScript | `promptscript` | `.agents/skills/` | project only |
| AdaL | `adal` | `.adal/skills/` | `~/.adal/skills/` |

The bundled installer ships the common subset. For an agent that is not in
`node scripts/install-skill.mjs --list`, use `--dest <that agent's skills dir>`.

---

## How you invoke it — `@`, `/`, `#`, `$`

Hosts disagree about punctuation. There is no universal syntax, and a skill cannot ship
a slash command of its own: the `/` menu is owned by the host, which may or may not
generate a `/<skill-name>` entry from the folder it found.

**Verified:** 2026-11-25, each row against the vendor's own documentation (links at the
end of this section). If your installed version disagrees, the vendor wins.

| Host | Attach context | Run a command or a skill | Other prefixes |
|---|---|---|---|
| Antigravity (App, CLI, IDE) | `@file`, `@folder`, `@rules:` and `@conversation:` (App only) | `/` menu; **a skill is auto-converted to `/<skill-name>`** | CLI: start a prompt with `@<subagent>` to message a subagent |
| OpenCode | `@file`, `@agent`, `@skill-id` | `/command` | `!` shell |
| Claude Code | `@path`, with optional line range `@file.ts#5-10` | `/command`, `/skill-name` | `!` shell |
| Cursor | `@file`, `@folder`, `@Terminals`, `@Chats`, `@Commit`, `@Branch`, `@Browser` | `/` lists skills and commands | `&` hands off to a Cloud Agent (CLI) |
| Codex CLI | `@` fuzzy file search | `/` slash commands, `/skills`, `/mention` | `!` shell |
| Codex desktop app | — | `/` commands; `$` invokes a skill explicitly | — |
| GitHub Copilot (VS Code) | `#file`, `#codebase`, `#terminalSelection` — **not `@`** | `/` commands and agent skills | `!` shell |
| Cline | `@` mentions | `/` built-in commands and skills | — |
| Roo Code | `@` context mentions | `/` commands; modes are commands too | — |
| Windsurf / Devin Desktop | `@` a past conversation | `/<workflow-name>` (Cascade) | — |
| Zed | `@file`, `@symbol`, `@thread`, `@skill`, `@url` | `/` skills, `/compact` | — |
| Gemini CLI | `@path` (file or directory) | `/command`, `/skills`, `/plan` | `!` shell |

Not re-checked on 2026-11-25: Amp, Warp, Droid, Kilo Code `@` mentions. Treat their
column as unknown rather than supported.

### What this means for ATLAS

| Host | Shortest reliable way to invoke it |
|---|---|
| Antigravity | `/atlas-project-architect`, or just describe the task |
| OpenCode | `@atlas-project-architect` |
| Claude Code | `/atlas-project-architect`, or describe the task |
| Cursor, Zed, Codex, Cline, Roo | `/<skill-name>` if it appears in the menu; otherwise describe the task |
| GitHub Copilot | `#` is context only — name the skill in words |
| Any host | `Use the atlas-project-architect skill.` |

Three things worth knowing:

- **`/plan` is not ATLAS.** It is each host's own read-only planning mode — Antigravity,
  Claude Code, Cursor, Codex and Gemini CLI all ship one. It plans; it does not research,
  gate approvals, version, or write `MEMORY.md`/`HANDOFF.md`. ATLAS's PLAN step is step 2
  of its core loop, not a command.
- **`/<skill-name>` exists only if the host generates it.** Antigravity and Zed do this for
  every skill; Claude Code, Cursor and Copilot list skills in the `/` menu. Where it does
  not appear, plain language is the portable path, because the agent still sees the skill's
  name and description on every turn.
- **No autocomplete means not loaded.** If `/atlas-project-architect` is missing, the host
  did not find the folder. Check the path in the table above, then start a new session —
  most hosts scan the skills directory at startup.

Sources: [Antigravity mentions](https://antigravity.google/docs/at-mentions/),
[skills](https://antigravity.google/docs/skills/),
[slash commands](https://antigravity.google/docs/slash-commands/) ·
[OpenCode TUI](https://opencode.ai/docs/cli/tui/),
[commands](https://opencode.ai/docs/commands/),
[skills](https://opencode.ai/docs/skills/) ·
[Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode),
[skills](https://code.claude.com/docs/en/skills) ·
[Cursor prompting](https://cursor.com/docs/agent/prompting),
[CLI slash commands](https://cursor.com/docs/cli/reference/slash-commands) ·
[Codex CLI](https://developers.openai.com/codex/developer-commands),
[app slash commands](https://developers.openai.com/codex/reference/slash-commands) ·
[Copilot chat](https://code.visualstudio.com/docs/copilot/copilot-chat) ·
[Cline commands](https://docs.cline.bot/core-workflows/using-commands),
[context](https://docs.cline.bot/core-workflows/working-with-files) ·
[Roo Code](https://docs.roocode.com/features/slash-commands) ·
[Kilo workflows](https://kilocode.ai/docs/customize/workflows) ·
[Windsurf / Devin Desktop](https://docs.devin.ai/desktop/cascade) ·
[Zed skills](https://zed.dev/docs/ai/skills), [agent panel](https://zed.dev/docs/ai/agent-panel) ·
[Gemini CLI](https://geminicli.com/docs/reference/commands/).

---

## Feature support

From the same upstream table. "Basic skills" is all ATLAS needs.

| Feature | OpenCode | OpenHands | Claude Code | Cline | CodeBuddy | Codex | Command Code | Kiro CLI | Cursor | Antigravity | Roo Code | Copilot | Amp | OpenClaw | Neovate | Pi | Qoder | Zencoder |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Basic skills | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `allowed-tools` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No |
| `context: fork` | No | No | Yes | No | No | No | No | No | No | No | No | No | No | No | No | No | No | No |
| Hooks | No | No | Yes | Yes | No | No | No | Yes | No | No | No | No | No | No | No | No | No | No |

Two consequences worth knowing:

- **No `context: fork` outside Claude Code.** The skill runs in your main context. That
  is fine — it is why `SKILL.md` is short and references load one at a time.
- **No hooks anywhere in ATLAS.** Nothing runs automatically. Every file write is the
  agent doing what you asked.

---

## Kiro CLI note

Kiro's default agent loads `.kiro/skills/` and `~/.kiro/skills/` with no config. A
**custom** agent needs the path registered in `.kiro/agents/<agent>.json`:

```json
{
  "resources": ["skill://.kiro/skills/**/SKILL.md"]
}
```

---

## Adding an agent to the installer

1. Find the path in the vendor's documentation.
2. Add an entry to `AGENTS` in `scripts/install-skill.mjs`.
3. Add a row to the table above with the verification date.
4. Run `node scripts/install-skill.mjs --list` and `node --test tests/install.test.mjs`.

Do not add a path you have not seen in a vendor source. A wrong path fails silently —
the agent simply never sees the skill.
