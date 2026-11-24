<div align="center">

<img src="assets/banner.svg" alt="ATLAS — Project Architect" width="100%">

<br><br>

[![Version](https://img.shields.io/badge/version-1.1.0-E8A33D?style=flat-square)](#versioning--one-source-of-truth)
[![License](https://img.shields.io/badge/license-MIT-2F81F7?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-3C873A?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-2F81F7?style=flat-square)](#versioning--one-source-of-truth)
[![Tests](https://img.shields.io/badge/tests-23-0F766E?style=flat-square)](docs/TESTING.md)
[![Agents](https://img.shields.io/badge/agents-60%2B-6B7C8F?style=flat-square)](docs/AGENT-COMPATIBILITY.md)

### Turn “build me this” into a project that survives week two.

A process harness for coding agents — not a code template, an order of operations.

<sub><b>Inspect → Research → Plan → Build → Prove → Ship → Handoff</b></sub>

</div>

---

## What it is

A skill you install once. After that, every project request — new app, existing repo,
broken build, redesign, audit, release — runs through the same loop: inspect the real
files, verify claims instead of trusting them, plan, build small, prove with a command,
record, hand off.

It is built for the failure mode that actually bites: an agent that produces an
impressive first hour and an unmaintainable second week. So it refuses to claim “done”
without running something, keeps one source of truth for the version, and leaves a
handoff a different agent can continue from.

**It is not** a code generator, a framework, a starter template, or a prompt that makes a
model smarter. It is the order of operations plus the artefacts that make the result
checkable.

---

## Install

```bash
git clone https://github.com/SudhirDevOps1/atlas-skill.git
cd atlas-skill
node scripts/install-skill.mjs --agent claude-code --scope global
```

Replace `claude-code` with `codex`, `cursor`, `antigravity`, `opencode`, `copilot`,
`gemini-cli`, `windsurf`, `cline`, `roo`, `kilo`, `amp`, `warp`, `zed`, `droid`,
`qwen`, `kiro`, `continue`, `openhands`, or `universal`. Run
`node scripts/install-skill.mjs --list` to see the paths.

| Agent | Project | Global |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Cursor | `.agents/skills/` | `~/.cursor/skills/` |
| Antigravity | `.agents/skills/` | `~/.gemini/config/skills/` |
| OpenCode | `.agents/skills/` | `~/.config/opencode/skills/` |
| GitHub Copilot | `.agents/skills/` | `~/.copilot/skills/` |

Full matrix, chat-UI fallback, updating and troubleshooting:
**[`INSTALL.md`](INSTALL.md)** · per-agent paths and sources:
**[`docs/AGENT-COMPATIBILITY.md`](docs/AGENT-COMPATIBILITY.md)**

### What to give the AI

| You give | You get |
|---|---|
| The task | A brief with guessed assumptions |
| Task + `PROJECT-INPUT.md` answers | A brief with far fewer guesses |
| Task + an existing repo | Brownfield audit, then a plan |
| Task + `ATLAS-MASTER-PROMPT.md` | The full rulebook in context — highest token cost |

The skill loads one reference at a time on purpose. Pasting all eleven costs 10–15× more
context and makes the result worse, not better.

### Then just ask

```text
> ye app banao: <idea>
> is repo ko fix karo
> deploy karna hai
```

The skill triggers on its own. You never have to name it.

---

## The loop

```mermaid
flowchart LR
  A([Idea / repo]) --> B[Inspect]
  B --> C[Research]
  C --> D[Plan]
  D --> E[Build]
  E --> F[Prove]
  F --> G[Ship]
  G --> H([Handoff])
  F -.->|fail| E
```

Every claim of “done” carries a command and its real output. If it wasn’t run, it says
**NOT RUN** — there is no third state.

---

## What's inside

| Artifact | What it is | When to use it |
|---|---|---|
| **`atlas-project-architect/`** | The skill — `SKILL.md` + 11 phase references + 6 templates + the version tool | Installed into an agent; loads only the phase it needs |
| **`ATLAS-MASTER-PROMPT.md`** | The full rulebook — 34 sections + appendix | One paste into a capable model when you want the complete contract |
| **`scripts/install-skill.mjs`** | Zero-dependency installer for 20 agents | Putting the skill where your agent reads it |
| **`scripts/version.mjs`** (inside the skill) | Zero-dependency SSOT version tool | Any project that ships more than once |

The skill is the operational core. The master prompt is the same thinking, expanded.

---

## Versioning — one source of truth

`package.json#version` (or root `version.json`) is the **only** hand-edited version.
Every other surface is generated and marked `AUTO-GENERATED — DO NOT EDIT`.

| Command | Effect |
|---|---|
| `version:bump patch` | `0.1.0` → `0.1.1` |
| `version:bump minor` | `0.1.0` → `0.2.0` |
| `version:bump major` | `0.1.0` → `1.0.0` |
| `version:bump alpha` | `0.1.0` → `0.2.0-alpha.1` |
| `version:bump beta` / `rc` / `stable` | channel promotion |
| `version:set 0.2.0-beta.0` | explicit version |
| `version:sync` | regenerate every derived surface |
| `version:verify` | CI gate — exit `1` on drift |

**Synced surfaces:** app constant · `public/version.json` · README badge · changelog ·
docs front matter · `index.html` meta · OpenAPI · Android `versionName`/`versionCode` ·
Tauri · Expo · Docker label · MEMORY / HANDOFF / status.

Bump is transactional: a failed write restores every file it already touched and exits
`3`. A project without `src/` or `public/` is not given empty scaffolding.

Monorepos: each publishable package keeps its own SSOT. `version:sync --all` is not in
the bundled script — run it per package, or use `pnpm -r run version:sync`.

---

## Repo map

```text
.
├── ATLAS-MASTER-PROMPT.md          full rulebook
├── INSTALL.md                      install in any agent
├── package.json                    SSOT (version) + scripts
├── assets/banner.svg
├── atlas-project-architect/        the installable skill
│   ├── SKILL.md                    trigger + core loop
│   ├── references/                 00 → 10, one per phase
│   ├── assets/templates/           AGENTS · MEMORY · HANDOFF · TASKS · ASSUMPTIONS · PROJECT-INPUT
│   └── scripts/version.mjs         SSOT tool
├── scripts/install-skill.mjs       installer for 20 agents
├── tests/                          version.test.mjs · install.test.mjs
├── docs/                           AGENT-COMPATIBILITY · PROJECT-STATUS · TESTING
├── examples/                       greenfield · brownfield audit
├── .github/workflows/ci.yml        Node 20 + 22, tests, drift gate
└── AGENTS · MEMORY · HANDOFF · TASKS · ASSUMPTIONS · SECURITY
```

---

## Compatibility

One `SKILL.md` folder works across agents that implement the
[Agent Skills specification](https://agentskills.io). ATLAS uses only `name` +
`description` front matter, relative file reads, and one plain Node script — no
`allowed-tools`, no `context: fork`, no hooks, no MCP. That is deliberate: the skill
behaves the same everywhere.

Verified against the upstream path table on 2026-11-24:
**[`docs/AGENT-COMPATIBILITY.md`](docs/AGENT-COMPATIBILITY.md)**.

---

## This repo runs on ATLAS

The skill is applied to its own repository — not just documented:

| Practice | Where |
|---|---|
| One source of truth for the version | `package.json` → `version:sync` regenerates the badge, changelog, docs and memory lines |
| Tests before claims | `tests/`, run in CI on Node 20 and 22 |
| Drift gate | CI fails if any generated surface disagrees with the SSOT |
| Continuity | `AGENTS.md` · `MEMORY.md` · `HANDOFF.md` · `TASKS.md` · `ASSUMPTIONS.md` |
| Honest status | [`docs/PROJECT-STATUS.md`](docs/PROJECT-STATUS.md) lists what is not built |
| Case study | [`examples/brownfield-audit.md`](examples/brownfield-audit.md) |

A different agent can pick this up from `HANDOFF.md` alone.

---

## Status

**Tested**

- `version.mjs` — 15 black-box tests: bump / set / sync / verify / show, `--dry-run`,
  drift detection, rollback on write failure, BOM preservation, both SSOT modes.
- `install-skill.mjs` — 8 tests: agent matrix, copy scope, overwrite guard, `--dry-run`,
  project/global resolution, usage errors, self-overwrite guard.
- Both run in CI on Node 20 and 22.

**Not tested**

- Skill behaviour is prompt-level. No automated eval suite exists.

**Deliberately absent**

- No application runtime, database, auth or hosting.
- No PRD or design system in this repo — it ships the process that produces them.

---

<div align="center">

<sub>MIT licensed · <a href="SECURITY.md">security policy</a> · not affiliated with any agent vendor</sub>

</div>
