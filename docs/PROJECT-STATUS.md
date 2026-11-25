# PROJECT-STATUS — atlas-skill

Version: 1.2.0
Stage: released (tag `v1.2.0` → `2e30e19`, CI run `45597837631` green)
Updated: 2026-11-25

## What works

| Capability | State | Evidence |
|---|---|---|
| Master prompt (34 sections + appendix) | shipped | `ATLAS-MASTER-PROMPT.md` |
| Portable skill (`SKILL.md` + 13 references + 6 templates) | shipped | `atlas-project-architect/` |
| 15-role agent team → 30 host files | shipped, drift-gated | `agent-roles.json`, `agents/`, `scripts/generate-agents.mjs --check` |
| SSOT version tool (`bump`/`set`/`sync`/`verify`/`show`) | shipped, tested | `tests/version.test.mjs` |
| Installer (`--list`/`--agent`/`--scope`/`--dest`/`--force`/`--dry-run`) | shipped, tested | `tests/install.test.mjs` |
| One-project setup (skill + agents + MCP, preview first) | shipped, tested | `scripts/setup-project.mjs`, `tests/setup-project.test.mjs` |
| Install guide for 20 agents + chat UI | shipped | `INSTALL.md` |
| Agent path matrix (60+) with sources | shipped | `docs/AGENT-COMPATIBILITY.md` |
| Worked examples | shipped | `examples/` |
| Version + agent drift gates in CI | shipped | `.github/workflows/ci.yml` |
| Memory set (AGENTS/MEMORY/HANDOFF/TASKS/ASSUMPTIONS) | shipped | repo root |
| Releases | published | `v1.0.0`, `v1.1.0`, `v1.2.0` (Latest, release notes published 2026-11-25) |

## Not built (deliberate)

- No application runtime, database, auth or hosting — none is required.
- No PRD or design system in this repo — the deliverable is the process that produces them.
- No eval harness for skill behaviour — the four CLIs are the only tested code.
- No `--all` monorepo iteration in the version tool — documented as per-package instead.

## Tests

```text
Command: node --test tests/version.test.mjs tests/install.test.mjs \
                   tests/agents.test.mjs tests/setup-project.test.mjs
Result:  51 passed, 1 skipped, 0 failed (52 total)
Env:     Node 26.13.0, Windows 11, 2026-11-25
Skip:    version rollback test (directory permissions are not enforced on Windows)
```

Suites: version 18 · install 10 · agents 9 · setup-project 15.

CI matrix: Node 22 and 24 on `ubuntu-latest` and `windows-latest`. The skipped rollback
test runs on the Ubuntu jobs, and the installer and setup CLI get a smoke test on every
combination.

Run `45591502306` (1.2.0 commit `3752be8`): **success** — 4/4 jobs, Node 22/24 × Ubuntu/Windows.
Run `45597837631` (release commit `2e30e19`, tag `v1.2.0`): **success** — 4/4 jobs.
Run `45378930334` (v1.0.0 commit): **success** — 15/15 on Node 20 and 22.
Run `45382872606` (v1.1.0 commit): **success** — 23/23, 0 skipped on Node 20 and 22,
installer smoke test included.

## Security posture

- MIT licensed; no contributor agreement required.
- Private vulnerability reporting via GitHub Security Advisories (`SECURITY.md`).
- Zero dependencies → no transitive supply-chain surface.
- Actions pinned to commit SHAs resolved from the GitHub API.
- `permissions: contents: read` on CI; no secrets are used.
- The installer refuses to overwrite an existing copy without `--force`, refuses its own
  source folder (including a Windows case variant) and refuses a destination inside it.
- The version tool only reads and writes the top-level `"version"`, rejects unknown flags,
  and refuses `minor`/`patch` above 99 so `versionCode` cannot collide.
- The setup CLI writes only inside `--project`, keeps existing servers and files unless
  `--force`, and marks its backup folder self-ignoring so a copied config cannot leak.
- No credentials, tokens or personal data in the repository.

## Distribution

- `git clone` + `node scripts/install-skill.mjs`
- ZIP download from the releases page
- Copy the `atlas-project-architect/` folder by hand
- Paste `SKILL.md` into a chat UI (no filesystem)

## Blockers

None.

## Next milestone

`1.3.0` — eval harness for skill behaviour (3–5 prompts, rubric, recorded output), and a
decision on `--all` for monorepos.
