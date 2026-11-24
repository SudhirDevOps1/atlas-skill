# Changelog

All notable changes to this repository.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/). Versions are generated from
`package.json#version` — see `version:sync`.

## [Unreleased]

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
  setup: preview by default, `--apply` to write, skill + 15 agents per host + four
  read-only MCP entries (`context7`, `playwright`, `github` `/readonly`, Supabase
  `read_only=true`). Project-local config only, no secrets, existing files and servers
  kept unless `--force`, backups before replacement, preflight validation and an
  idempotent second run. Paths and endpoints cite vendor docs checked 2026-11-24.
- `tests/setup-project.test.mjs` — 11 black-box checks: dry-run writes nothing, correct
  nested `mcp.servers` shape, read-only endpoints, idempotence, existing-config
  preservation, invalid-JSON/JSONC refusal, scoped selection, backup on `--force` and
  unsafe-target rejection.

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
- `.github/workflows/ci.yml` — syntax checks and tests cover all four CLIs; added the
  agent-SSOT drift gate and a project-setup smoke test.
- `README.md` — tests badge updated to 43 and the one-project setup guide is linked from
  the install section.

### Fixed

- `docs/SKILL-STACK.md` — Vercel skills use the CLI-published namespaced names
  (`vercel-react-best-practices`, `vercel-react-view-transitions`,
  `vercel-composition-patterns`), verified against `npx skills add --list` on 2026-11-24.

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

[Unreleased]: https://github.com/SudhirDevOps1/atlas-skill/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/SudhirDevOps1/atlas-skill/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SudhirDevOps1/atlas-skill/releases/tag/v1.0.0
