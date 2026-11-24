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
