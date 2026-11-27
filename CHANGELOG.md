# Changelog

All notable changes to this repository.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project uses [Semantic Versioning](https://semver.org/). Versions are generated from
`package.json#version` — see `version:sync`.

## [Unreleased]

### Changed

- `ATLAS-MASTER-PROMPT.md` — now genuinely drop-in for any project: removed hard-coded
  Hinglish/₹0/Windows-8 GB defaults, added a mode-aware start rule (brownfield and repair
  begin with findings and real command output, not a nine-point brief), defined "major
  decision" so small tasks do not stall in research, and added §1.2 — the eleven-file
  deliverables contract (`PRD`, `DESIGN`, `TECH_STACK`, `TASKS`, `ARCHITECTURE`,
  `DATABASE_SCHEMA`, `API_DOCUMENTATION`, `USER_FLOWS`, `ACCEPTANCE_CRITERIA`, `README`,
  `.env.example`) with read-before-write, `UNKNOWN`-instead-of-invention, dated sources and
  no-secrets rules. §14.9 now directs projects with the installed skill to the existing
  single-file `scripts/version.mjs` instead of a seven-file layout that does not exist.
  Added §0.6 — eight hard gates that survive context pressure.
- `ATLAS-MASTER-PROMPT.md` — consent, permissions and policy handling. New §1.3 defines
  conditional legal deliverables (`COOKIE_POLICY.md`, `PRIVACY.md`, `TERMS.md`,
  `PERMISSIONS.md`, third-party notices, `REVIEW-NEEDED.md`) triggered by what the project
  actually does; §9.10 adds consent/permission UX rules (no pre-ticked boxes, equal
  prominence, request in context, working denial path); §13.5 adds a real data inventory,
  four cookie classes and a minimum consent record; §23.3 makes every legal document a
  `DRAFT — requires legal review` until approved. Non-negotiables 11–12 forbid fabricated
  compliance claims and accepting terms/permissions on the user's behalf. §25 adds approval
  gates for new tracking, consent defaults and accepting terms; §16.3 requires testing
  consent and permission outcomes. This is engineering guidance, not legal advice.
- `ATLAS-MASTER-PROMPT.md` — generated avatars and data protection. §9.11 uses DiceBear v11
  when a project actually needs avatars: language-matched core (`@dicebear/core` +
  `@dicebear/styles`, seven native cores), `llms.txt` read before coding, no pre-10 forms,
  CSPRNG/non-PII seed, per-style licence check (44 CC0, 14 CC BY, 1 MIT, 4 artist terms),
  a11y and proof-of-render. §13.6 chooses hash vs encrypt per field from OWASP's current
  cheat sheets: Argon2id for passwords, AES-GCM for PII shown back, HMAC blind indexes for
  lookups, keys in a vault, rotation plan, and evidence before claiming "encrypted". Both
  are conditional — a project writes "not applicable" when it has no such need. Verified
  against vendor sources on 2026-11-27.

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
- `docs/AGENT-COMPATIBILITY.md` — a "How you invoke it" section: which hosts use `@` for
  context, which use `/` for commands and skills, and which use neither (`#` in GitHub
  Copilot, `$` for explicit skill invocation in the Codex desktop app). Includes the
  per-host way to invoke ATLAS and the distinction between a host's `/plan` and ATLAS's
  own PLAN step. Verified against vendor documentation on 2026-11-25.

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
- `README.md` and `INSTALL.md` — explicit invocation now shows `/atlas-project-architect`
  where the host converts an installed skill into a slash command, `@` only for OpenCode,
  and plain language as the portable fallback. Corrects the earlier claim that the skill
  has no slash command: the folder ships none, but Antigravity and Zed generate one.

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
