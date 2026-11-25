# Changelog

All notable changes to this repository.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/). Versions are generated from
`package.json#version` — see `version:sync`.

## [Unreleased]

Nothing yet.

## [1.2.0] - 2026-11-25

### Added

- `UNIVERSAL-AGENT-PROMPT.md` — a paste-ready, approval-first operating contract: 13
  sections covering specialist roles, project preservation, research, UI/UX, animation,
  backend, database, security, testing, the approval gate, execution, the final report and
  conflict resolution. §13 states which rule wins when it is loaded alongside ATLAS.
- `docs/SKILL-STACK.md` — the equipment list: best skill per domain (UI/UX, React/Next.js,
  animation, security, database, reverse engineering, testing, debugging, documents), the
  repository, star snapshot and licence behind each one, per-agent fit for Antigravity,
  OpenCode, Claude Code, Codex, Cursor and Copilot, the MCP servers worth adding, and what
  not to install. Verified against the upstream repositories on 2026-11-24.
- Real 15-role sub-agent team. `atlas-project-architect/agent-roles.json` is the single
  source of truth; `scripts/generate-agents.mjs` generates 30 host-specific definitions:
  OpenCode `.opencode/agents/<id>.md` (`mode: subagent`, ordered permissions) and
  Antigravity `.agents/agents/<id>.md` (`subagent: true`, `mainAgent: false`,
  `model: inherit`, `commandExecutionPolicy`). Review roles are read-only; writing roles
  use `ask`/`sandbox`. Formats verified against official host docs on 2026-11-24.
- `atlas-project-architect/references/11-agent-team.md` and `ATLAS_AGENT_ROLE_MAP.md` —
  coordinator loop, activation map, delegation packet, handoff contract, conflict order,
  approval boundaries and distribution rules. The parent stays the single accountable
  lead; a role is a responsibility boundary, not an independent owner.
- `tests/agents.test.mjs` — 9 black-box checks for ID uniqueness, persona completeness,
  gated permissions, verified Antigravity tool names, absence of deprecated OpenCode
  fields and agreement between the role map, reference and SSOT.
- `scripts/setup-project.mjs` and `docs/PROJECT-SETUP.md` — one-project, approval-first
  setup: preview by default, `--apply` to write, skill + 15 agents per host + four MCP
  entries (`context7`, `playwright`, `github` `/readonly`, Supabase `read_only=true`).
  Three are read-only by construction; Playwright is a local browser-automation process,
  pinned to `@playwright/mcp@0.0.86`. Project-local config only, no secrets, existing
  files and servers kept unless `--force`, backups before replacement, preflight
  validation and an idempotent second run. Paths and endpoints cite vendor docs checked
  2026-11-24.
- `tests/setup-project.test.mjs` — 15 black-box checks: dry-run writes nothing, correct
  nested `mcp.servers` shape, the four endpoints, idempotence, existing-config
  preservation, invalid-JSON/JSONC refusal, scoped selection, backup on `--force`,
  UTF-8 BOM preservation, no rewrite/backup for a 0-added merge, the backup `.gitignore`,
  ancestor-directory preflight and unsafe-target rejection.
- `docs/DRISHTI-BROWSER-AI-PLAN.md` — read-only audit of the Drishti Browser AI extension
  (repo, HEAD `ec1ac8c`, 2026-11-25): verified-vs-claimed evidence table, ten findings, and
  a P0–P3 additive plan. No feature, tool, permission or screen is removed; all 37 MCP
  tools stay and a snapshot test is proposed to freeze them.
- `atlas-project-architect/references/12-browser-extension-mcp.md` — domain pack for MV3
  extensions, local bridges and MCP servers: three-process shape, permission budget,
  service-worker lifecycle, message envelope, page/prompt-injection boundary, bridge
  handshake, tool naming/schema/error/approval contract, six-test regression set, release
  rules and anti-patterns.
- `README.md` — "One-prompt install: Drishti Browser AI" with a `<DRISHTI_ATLAS_INSTALL>`
  prompt that clones the public repo, builds and proves every package, generates a
  gitignored token, wires the MCP server, starts the bridge on demand, and leaves the two
  browser steps to the human.

### Changed

- `README.md` — "What's inside" and "What to give the AI" now list the universal prompt
  and the skill stack; repo map updated.
- `INSTALL.md` — strict-approval-mode section, and a "next — the rest of the stack" pointer
  so the installer path does not dead-end at the skill.
- `AGENTS.md` — purpose and structure list the new documents.
- `atlas-project-architect/SKILL.md` — phase playbook gains step 10 (agent team) and a
  pointer to the role map. Existing 33-section master prompt and all 9 capability packs
  are untouched.
- `package.json` — `check`, `test` and `verify` now include the generator syntax check,
  the agent tests, the setup CLI/tests and the `--check` drift gate; added
  `agents:generate`, `agents:check`, `setup:list`, `setup:preview` and `setup:apply`.
  `engines.node` is `>=22`; `setup:apply` passes `--apply`.
- `.github/workflows/ci.yml` — syntax checks and tests cover all four CLIs; added the
  agent-SSOT drift gate and a project-setup smoke test. Matrix is Node 22/24 on
  `ubuntu-latest` and `windows-latest`, so the Windows-only skip is exercised on Linux and
  the case-insensitive path guard is exercised on Windows. `.github/dependabot.yml` keeps
  the pinned Actions current.
- `README.md` — tests badge updated to 52 and the one-project setup guide is linked from
  the install section.
- `atlas-project-architect/SKILL.md` and `docs/SKILL-STACK.md` — the browser-extension/MCP
  pack is wired into the phase playbook and the Tier B domain list.
- `README.md`, `atlas-project-architect/README.md`, `AGENTS.md` — reference count corrected
  to thirteen files (`00`–`12`), with the three packs named separately from the ten phases.

### Fixed

- `scripts/install-skill.mjs` — **P0**: a `--dest` whose path differed only by case from the
  source folder (for example `c:\repo` vs `C:\Repo` on Windows) passed the self-overwrite
  check, and the delete-then-copy step removed the source, including `SKILL.md`. The
  installer now resolves real paths, compares case-insensitively on Windows, refuses a
  destination inside the source tree, and copies to a sibling temp directory before
  swapping. Two regression tests added.
- `atlas-project-architect/scripts/version.mjs` — **P0**: the `"version"` regex matched
  npm's `scripts.version` lifecycle hook. `show` reported the script text and `set` rewrote
  the script while the root `version` stayed at its old value. A depth-aware JSON scanner
  now reads and writes only the top-level key. Three regression tests added.
- `atlas-project-architect/scripts/version.mjs` — unknown flags now exit `2` with usage
  instead of being silently ignored; `--help` prints usage; `minor`/`patch` above 99 are
  rejected because `versionCode` collided (`1.100.0` and `2.0.0` both produced `20000900`).
- `scripts/setup-project.mjs` — a config saved with a UTF-8 BOM (PowerShell 5.1 default)
  was rejected with `Unexpected token '\ufeff'`; it is now parsed and written back with the
  BOM intact.
- `scripts/setup-project.mjs` — a merge that added zero servers still reformatted the whole
  file and wrote a backup. It now returns early when `added === 0`.
- `scripts/setup-project.mjs` — Playwright MCP was described as read-only and pinned to
  `@latest`. It is local browser automation, not a read-only server, and is now pinned to
  `0.0.86`; the header, `--list` output and docs say so.
- `scripts/setup-project.mjs` — the backup folder could contain an existing config with
  credentials and was not ignored by git. `.atlas-setup/.gitignore` now contains `*`.
- `scripts/setup-project.mjs` — preflight checked only the final folder, so a file at an
  ancestor path failed mid-run after the skill was installed. Every existing segment is now
  checked before any write, and a mid-run failure reports the action count and how to
  resume.
- `package.json` — `setup:apply` ran the preview because it did not pass `--apply`.
- `docs/SKILL-STACK.md` — Vercel skills use the CLI-published namespaced names
  (`vercel-react-best-practices`, `vercel-react-view-transitions`,
  `vercel-composition-patterns`), verified against `npx skills add --list` on 2026-11-24.
- Docs truth pass — README, AGENTS, MEMORY, TASKS, ASSUMPTIONS, SECURITY, PROJECT-STATUS,
  TESTING, PROJECT-SETUP and the skill README now state the real reference count (13),
  CLI count (4), test count (52), Node floor (22) and CI matrix (22/24 × Ubuntu/Windows).

### Verified

```text
Command: pnpm run verify
Result:  51 passed, 1 skipped, 0 failed (52 total)
         30 agent files match the SSOT (15 roles x 2 hosts)
         1.2.0 in sync (stable, code 10200900)
Env:     Node 26.13.0, Windows 11, 2026-11-25
Skip:    version rollback test — directory permissions are not enforced on Windows
```

The 2 × 2 CI matrix run `45591502306` on commit `3752be8` is **success** (4/4 jobs:
Node 22/24 × Ubuntu/Windows).

## [1.1.0] - 2026-11-24

Public release. The repository is now installable in any agent that reads `SKILL.md`,
and every "personal / private / no redistribution" statement is gone.

### Added

- `INSTALL.md` — install in Claude Code, Codex, Cursor, Antigravity, OpenCode, Copilot,
  Gemini CLI, Cline, Windsurf, Roo, Kilo, Amp, Warp, Zed, Droid, Qwen, Kiro, Continue,
  OpenHands, or any other `SKILL.md` agent. Includes the chat-UI fallback, updating,
  uninstalling and troubleshooting.
- `docs/AGENT-COMPATIBILITY.md` — full 60+ agent path matrix with the upstream source and
  verification date, plus the feature-support table.
- `scripts/install-skill.mjs` — zero-dependency installer: `--list`, `--agent`,
  `--scope project|global`, `--dest`, `--force`, `--dry-run`. Refuses to overwrite an
  existing copy without `--force` and refuses to install over its own source.
- `tests/install.test.mjs` — 8 black-box tests for the installer.
- `examples/greenfield.md`, `examples/brownfield-audit.md` — the process on an empty repo
  and on this repository itself, with real numbers.
- `SECURITY.md` — private reporting via GitHub Security Advisories, scope, safe harbour.
- Repository self-management, carried over from the 1.0.0 follow-up: `package.json` as the
  version SSOT, `tests/version.test.mjs` (15 tests), CI with a drift gate, and the memory
  set (`AGENTS`, `MEMORY`, `HANDOFF`, `TASKS`, `ASSUMPTIONS`).

### Changed

- `LICENSE` — proprietary, all rights reserved → **MIT**.
- `README.md` — rewritten for a public audience: install matrix, compatibility, honest
  limits, no private-repo framing.
- `atlas-project-architect/README.md` — install matrix and limits; the old
  `.cursor/rules` advice is now a fallback, not the recommended path.
- `ATLAS-MASTER-PROMPT.md` §14.4 — the flag table now states which flags the bundled
  script implements instead of implying all of them.
- `package.json` — `license: MIT`, `check`/`test` cover both CLIs.
- CI — syntax-checks both CLIs, runs both test files, and smoke-tests the installer.

### Removed

- "Personal repository", "private", "single owner" and "no redistribution" wording from
  `README.md`, `LICENSE`, `AGENTS.md`, `MEMORY.md`, `HANDOFF.md`, `ASSUMPTIONS.md`,
  `docs/PROJECT-STATUS.md` and `atlas-project-architect/README.md`.

### Verified

- `node --test tests/version.test.mjs tests/install.test.mjs` → 23 passed, 1 skipped, 0 failed (Windows).
- CI on `ubuntu-latest`, Node 20 and 22 → 24/24, 0 skipped.
- `version:verify` → no drift; `sync` twice → no diff.

## [1.0.0] - 2026-11-24

### Added

- `ATLAS-MASTER-PROMPT.md` — the full rulebook: 34 sections + appendix.
- `atlas-project-architect/` — portable skill: `SKILL.md`, 11 phase references, 6 templates.
- `scripts/version.mjs` — zero-dependency SSOT version tool (`bump` / `set` / `sync` /
  `verify` / `show`), transactional and BOM-safe.
- `assets/banner.svg` — hand-authored repository hero.
- `LICENSE` — initial license terms.

### Verified

- `version.mjs`: bump, set, sync, verify, show, `--dry-run`, drift detection, rollback on
  write failure, BOM preservation, both SSOT modes.

### Known limits

- `--all` monorepo iteration is not in the bundled script; run it per package.
- Skill behaviour is prompt-level; no automated eval suite has been run.

[Unreleased]: https://github.com/SudhirDevOps1/atlas-skill/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/SudhirDevOps1/atlas-skill/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/SudhirDevOps1/atlas-skill/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SudhirDevOps1/atlas-skill/releases/tag/v1.0.0
