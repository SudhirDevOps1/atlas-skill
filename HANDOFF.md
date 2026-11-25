# HANDOFF — 2026-11-25

Current version: 1.2.0

## State

v1.1.0 is the last published release; `1.2.0` is the unreleased hardening candidate on
branch `fix/p0-hardening`. The repository is MIT licensed, installable in any agent that
reads `SKILL.md`, and still managed by its own skill: one version SSOT, four tested CLIs,
an agent-SSOT drift gate, CI with version and agent drift gates, and the memory set.

## Changed this session

- Repository visibility: private → **public**; topics added; description kept.
- `LICENSE` — proprietary/all-rights-reserved → **MIT**.
- `SECURITY.md` — private reporting via GitHub Security Advisories, scope, safe harbour.
- `INSTALL.md` — install in Claude Code, Codex, Cursor, Antigravity, OpenCode, Copilot,
  Gemini CLI, Cline, Windsurf, Roo, Kilo, Amp, Warp, Zed, Droid, Qwen, Kiro, Continue,
  OpenHands, or any `SKILL.md` agent; chat-UI fallback; updating; uninstalling;
  troubleshooting.
- `docs/AGENT-COMPATIBILITY.md` — 60+ agent path matrix, upstream source, verification
  date, feature-support table.
- `scripts/install-skill.mjs` — zero-dependency installer with `--list`, `--agent`,
  `--scope`, `--dest`, `--force`, `--dry-run`; overwrite and self-overwrite guards.
- `tests/install.test.mjs` — 8 black-box tests.
- `examples/greenfield.md`, `examples/brownfield-audit.md` — the process on an empty repo
  and on this repository.
- `README.md` — rewritten for a public audience.
- `atlas-project-architect/README.md` — install matrix and limits.
- `ATLAS-MASTER-PROMPT.md` §14.4 — flag table now shows what the bundled script actually
  implements.
- `package.json` — MIT, `check`/`test` cover both CLIs, installer scripts.
- CI — syntax-checks both CLIs, runs both test files, smoke-tests the installer.
- Removed every "personal / private / single owner / no redistribution" statement.

### Follow-up session — 2026-11-24

- `UNIVERSAL-AGENT-PROMPT.md` — 13-section approval-first operating contract, paste-ready.
  §13 resolves overlap with ATLAS: safety and destructive-action approval win; reversible
  edits inside an approved ATLAS plan do not need per-file approval.
- `docs/SKILL-STACK.md` — verified equipment list: best skill per domain, star/licence
  snapshot from 2026-11-24, per-agent mapping, MCP table, install commands and exclusions.
  Vercel skills use the CLI-published names (`vercel-react-best-practices` etc.).
- `README.md`, `INSTALL.md`, `AGENTS.md`, `CHANGELOG.md` — wired to both new documents.
- Pushed: `1fabd6a` (docs), `40a06c2` (name fix). No release; version stays 1.1.0.

**Local stack installed after approval** (OpenCode + Antigravity, global):

- Skills: `web-design-guidelines`, `vercel-react-best-practices`, `better-ui`, `gsap-core`,
  `code-security`, `supabase-postgres-best-practices`, `test-driven-development`,
  `systematic-debugging`.
- OpenCode MCP: `context7`, `playwright`, `chrome-devtools`, `github` (remote OAuth),
  `supabase` (read-only OAuth), `rea` (pre-existing), `postgres` (disabled until a DSN is set).
- Antigravity MCP: same seven in `~/.gemini/config/mcp_config.json`; `postgres` disabled.
- Config backups: `opencode.json.pre-mcp-backup`, `mcp_config.json.pre-mcp-backup`.

### Session — 2026-11-25

- `README.md` — "One-prompt install: Drishti Browser AI" with `<DRISHTI_ATLAS_INSTALL>`:
  clone from GitHub, build every package, gate on test / typecheck / version verify,
  generate a gitignored 64-hex token, wire `mcpServers.drishti-browser-ai`, start the
  bridge on demand, and leave Load-unpacked + Ping to the human. No feature removal; all
  37 tools stay.
- `docs/DRISHTI-BROWSER-AI-PLAN.md` — read-only audit of
  `SudhirDevOps1/drishti-browser-ai` at HEAD `ec1ac8c` (2026-11-25): verified-vs-claimed
  evidence, ten findings (naming, placeholder security contact, unpinned actions, missing
  typecheck/version gates, release checksum, `<all_urls>` decision record, tool
  classification, hard-coded test numbers, hand-maintained tool docs, no project
  `SKILL.md`) and a P0–P3 additive plan.
- `atlas-project-architect/references/12-browser-extension-mcp.md` — MV3 + bridge + MCP
  domain pack; wired into `SKILL.md` and the Tier B list in `docs/SKILL-STACK.md`.
- `tests/setup-project.test.mjs` — installed-skill assertion compares against the source
  folder instead of a hard-coded 52, so adding a reference cannot break it.
- Reference count corrected to thirteen files (`00`–`12`) in `README.md`,
  `atlas-project-architect/README.md` and `AGENTS.md`.
- `D:\coding project\chrome extension` was read-only context; no file there was modified.

### Session — 2026-11-25 (hardening)

Two P0 bugs were reproduced first, then fixed; P1 gaps were closed; docs were corrected to
match the code.

- `scripts/install-skill.mjs` — **P0**: a lowercased `--dest` resolved to the source folder
  on Windows and the pre-copy delete removed `SKILL.md`. The installer now resolves real
  paths, compares case-insensitively on Windows, refuses a destination inside the source,
  and copies to a sibling temp directory before swapping.
- `atlas-project-architect/scripts/version.mjs` — **P0**: the `"version"` regex matched
  npm's `scripts.version` hook, so `show` reported the script and `set` rewrote it while the
  root version stayed put. A depth-aware scanner now reads and writes only the top-level
  key. Also: unknown flags exit `2`, `--help` exists, and `minor`/`patch` above 99 are
  rejected because `versionCode` collided (`1.100.0` and `2.0.0` → `20000900`).
- `scripts/setup-project.mjs` — BOM-aware config read/write, no rewrite or backup when a
  merge adds nothing, a pinned Playwright MCP (`0.0.86`) instead of `@latest`, a
  self-ignoring `.atlas-setup/.gitignore`, ancestor-directory preflight, and a resumable
  failure message. The header and `--list` no longer call Playwright read-only.
- `package.json` — `setup:apply` now actually passes `--apply`; `engines.node` is `>=22`.
- Tests — 15 new regression cases (version 18, install 10, agents 9, setup 15 = 52).
- CI — Node 22/24 × Ubuntu/Windows matrix; `shell: bash`; portable `mktemp -d`.
- `.github/dependabot.yml` — monthly, GitHub Actions only.
- Docs — README, AGENTS, MEMORY, TASKS, ASSUMPTIONS, SECURITY, PROJECT-STATUS, TESTING,
  PROJECT-SETUP and the skill README corrected to the real counts, matrix and wording.

## Verified

```text
Command: node --test tests/version.test.mjs tests/install.test.mjs \
                   tests/agents.test.mjs tests/setup-project.test.mjs
Result:  51 passed, 1 skipped, 0 failed (52 total)
Env:     Node 26.13.0, Windows 11, 2026-11-25
Skip:    version rollback test — directory permissions are not enforced on Windows
```

```text
Command: node scripts/generate-agents.mjs --check
Result:  check OK: 30 agent files match the SSOT (15 roles x 2 hosts)
```

```text
Command: node atlas-project-architect/scripts/version.mjs verify
Result:  OK — 1.2.0 in sync (stable, code 10200900)
```

```text
Command: node scripts/install-skill.mjs --list
Result:  20 agents, project + global paths (source: vercel-labs/skills docs/agents.md)
```

```text
Command: gh run view 45382872606
Result:  success — verify (node 20) 10s, verify (node 22) 13s
         23/23 tests, 0 skipped, installer smoke test passed
Env:     GitHub Actions, ubuntu-latest, 2026-11-24  (last published-tag run)
```

```text
Command: gh run view 45591502306
Result:  success — 4/4 jobs: verify (ubuntu-latest, node 22/24) and
         verify (windows-latest, node 22/24); all steps green
Env:     GitHub Actions, 2026-11-25, commit 3752be8
```

The `fix/p0-hardening` branch is pushed and `main` was fast-forwarded to the same commit.
Both refs point at the same commit; no force-push was used.

## Broken / failing

Nothing known.

## Next 3 actions

1. Decide the release: tag `v1.2.0` (minor — the Unreleased section carries Added features)
   and publish, or keep `1.2.0` unreleased for longer. `v1.0.0`/`v1.1.0` stay immutable.
2. Re-check the README one-prompt installer on a real second machine (project-only and
   global) and record the observed paths.
3. Implement **P0 only** of `docs/DRISHTI-BROWSER-AI-PLAN.md` in the Drishti repo after
   separate approval: pin CI actions, add `typecheck` + `version:verify` gates, release
   preflight and checksum, real security contact. Read
   `references/12-browser-extension-mcp.md` first; remove nothing.

## Do not change

- `LICENSE` terms (MIT) without an explicit decision and a changelog entry.
- The published tags and releases — `v1.0.0` and `v1.1.0` are immutable.
- The installer's overwrite guard: no silent replacement without `--force`, and no path
  that resolves to its own source.
- The `version.mjs` behaviour contract without updating tests and reference 07.

## Environment notes

- Required env var NAMES: none.
- Local machine: Node 26.13.0, pnpm 12.10.1, PowerShell 5.1 (writes UTF-8 BOM).
- Windows quirk: `chmod` on directories is not enforced; the rollback test skips there.
- Tests redirect "global" installs by overriding `USERPROFILE`/`HOME`.
