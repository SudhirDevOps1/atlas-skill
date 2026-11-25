# TESTING — atlas-skill

## Commands

```bash
# everything CI runs
pnpm run verify

# or individually
node --check atlas-project-architect/scripts/version.mjs
node --check scripts/install-skill.mjs
node --check scripts/generate-agents.mjs
node --check scripts/setup-project.mjs
node --test tests/version.test.mjs tests/install.test.mjs \
           tests/agents.test.mjs tests/setup-project.test.mjs
node scripts/generate-agents.mjs --check
node atlas-project-architect/scripts/version.mjs verify
```

## What the suites cover

All four suites are black-box: every test builds a throwaway directory in the OS temp
folder and runs the real CLI as a child process. No internal function is imported.

### `tests/version.test.mjs` — 18 cases

| # | Behaviour |
|---|---|
| 1 | `show --json` reports version, channel, versionCode and next versions |
| 2 | `bump patch` updates every derived surface, badge colour intact |
| 3 | Android `versionCode` formula across alpha → beta → rc → stable |
| 4 | `sync` is idempotent (byte-identical second run) |
| 5 | `verify` passes clean, fails on a hand-edited surface |
| 6 | `verify --json` returns structured drift |
| 7 | invalid versions and unknown commands exit non-zero with the right code |
| 8 | downgrade blocked without `--allow-downgrade` |
| 9 | `--dry-run` writes nothing |
| 10 | `version.json` works as the SSOT when `package.json` is absent |
| 11 | projects without `src/` or `public/` are not given empty scaffolding |
| 12 | changelog entries land under `## [Unreleased]`, never duplicated |
| 13 | prerelease numbers are capped at 99 |
| 14 | a UTF-8 BOM in the SSOT is preserved |
| 15 | the **top-level** `version` is read and written, not `scripts.version` |
| 16 | unknown flags exit `2` with usage |
| 17 | `minor`/`patch` above 99 are rejected, so `versionCode` cannot collide |
| 18 | a failed write rolls back the SSOT and every already-written file |

### `tests/install.test.mjs` — 10 cases

| # | Behaviour |
|---|---|
| 1 | `--list` prints the verified agent matrix |
| 2 | `--dest` installs the skill folder and nothing else |
| 3 | an existing copy is kept without `--force`, replaced with it |
| 4 | `--dry-run` writes nothing |
| 5 | project scope resolves against the working directory |
| 6 | global scope resolves against the home directory |
| 7 | bad input exits `2` with a usage error |
| 8 | installing over its own source folder is refused |
| 9 | a destination **inside** the source folder is refused |
| 10 | a case-variant path to the source is refused on Windows |

Test 6 redirects `HOME`/`USERPROFILE` to a temp directory, so a global install in a test
never touches the real home folder.

### `tests/agents.test.mjs` — 9 cases

| # | Behaviour |
|---|---|
| 1 | `agent-roles.json` defines 15 unique, valid role IDs |
| 2 | every role has a complete persona and a known preset |
| 3 | presets gate write and shell actions, never blanket-allow |
| 4 | `generate-agents.mjs --check` is a clean, read-only drift gate |
| 5 | the generator rejects unknown arguments with exit `2` |
| 6 | all 30 generated files exist with the five required sections |
| 7 | OpenCode frontmatter uses only the verified V2 shape |
| 8 | Antigravity frontmatter uses only documented fields and tool names |
| 9 | the role map and the agent-team reference agree on 15 roles |

### `tests/setup-project.test.mjs` — 15 cases

| # | Behaviour |
|---|---|
| 1 | `--list` prints the verified paths and MCP endpoints |
| 2 | the default run is a dry-run and writes nothing |
| 3 | `--apply` installs the skill once, 15 agents per host and four MCP configs |
| 4 | a second apply is idempotent |
| 5 | existing MCP servers and unrelated config keys are preserved |
| 6 | invalid existing JSON is refused during dry-run |
| 7 | a non-object container is refused |
| 8 | an existing `opencode.jsonc` blocks the merge instead of being guessed |
| 9 | `--components` and `--hosts` limit what is written |
| 10 | `--force` replaces a local edit and keeps a backup |
| 11 | a UTF-8 BOM config is accepted and the BOM is preserved |
| 12 | a config where every server already exists is neither rewritten nor backed up |
| 13 | backups are kept out of git by `.atlas-setup/.gitignore` |
| 14 | a file where a directory is required is refused before any write |
| 15 | bad usage and unsafe targets are rejected |

## Current result

```text
Command: node --test tests/version.test.mjs tests/install.test.mjs \
                   tests/agents.test.mjs tests/setup-project.test.mjs
Result:  51 passed, 1 skipped, 0 failed (52 total)
Time:    ~15s (Windows; varies with disk cache)
Env:     Node 26.13.0, Windows 11, 2026-11-25
```

The skipped test is version case #18. Windows does not enforce directory permissions, so
a write failure cannot be simulated portably there. It runs on the Ubuntu CI jobs and the
behaviour was verified manually on Windows with a read-only file (`EPERM` on rename).

## CI

`.github/workflows/ci.yml` runs a 2 × 2 matrix — Node 22 and 24 on `ubuntu-latest` and
`windows-latest`:

1. syntax check for all four CLIs
2. all four test files
3. `generate-agents --check` (agent SSOT drift gate)
4. `version:verify` (version drift gate)
5. `sync` then `git diff --exit-code` (sync must be a no-op)
6. installer smoke test into a temp directory

Actions are pinned to commit SHAs, never moving tags; `.github/dependabot.yml` keeps them
current.

## Known gaps

- No eval suite for skill behaviour — the prompts and the process are untested by CI.
- No test for `--all` — not implemented.
- No performance test; every CLI is O(number of files it touches).
- No concurrency test; the version tool is a single-writer tool by design.
- No end-to-end test that starts an MCP server; the setup suite asserts the written
  config, not a live connection.

## Reproducing a failure

```bash
node --test tests/version.test.mjs --test-name-pattern="<test name>"
node --test tests/install.test.mjs --test-name-pattern="<test name>"
node --test tests/agents.test.mjs --test-name-pattern="<test name>"
node --test tests/setup-project.test.mjs --test-name-pattern="<test name>"
```

The temp fixtures are deleted after the run. To keep one for inspection, comment out the
`after()` cleanup and re-run.
