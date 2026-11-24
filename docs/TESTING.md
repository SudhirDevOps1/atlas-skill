# TESTING — atlas-skill

## Commands

```bash
# everything CI runs
pnpm run verify

# or individually
node --check atlas-project-architect/scripts/version.mjs
node --check scripts/install-skill.mjs
node --test tests/version.test.mjs tests/install.test.mjs
node atlas-project-architect/scripts/version.mjs verify
```

## What the suites cover

Both suites are black-box: every test builds a throwaway directory in the OS temp folder
and runs the real CLI as a child process. No internal function is imported.

### `tests/version.test.mjs` — 15 cases

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
| 15 | a failed write rolls back the SSOT and every already-written file |

### `tests/install.test.mjs` — 8 cases

| # | Behaviour |
|---|---|
| 1 | `--list` prints the agent matrix with the verified paths |
| 2 | `--dest` installs the skill folder and does not copy the repo |
| 3 | an existing copy is kept without `--force`, replaced with it |
| 4 | `--dry-run` writes nothing |
| 5 | project scope resolves against the working directory |
| 6 | global scope resolves against the home directory |
| 7 | bad input exits `2` with a usage error |
| 8 | installing over its own source folder is refused |

Test 6 redirects `HOME`/`USERPROFILE` to a temp directory, so a global install in a test
never touches the real home folder.

## Current result

```text
Command: node --test tests/version.test.mjs tests/install.test.mjs
Result:  22 passed, 1 skipped, 0 failed
Time:    5.2s
Env:     Node 26.13.0, Windows 11, 2026-11-24
```

The skipped test is version case #15. Windows does not enforce directory permissions, so
a write failure cannot be simulated portably there. It runs on the Linux CI matrix and the
behaviour was verified manually on Windows with a read-only file (`EPERM` on rename).

## CI

`.github/workflows/ci.yml` runs on Node 20 and 22:

1. syntax check for both CLIs
2. both test files
3. `version:verify` (drift gate)
4. `sync` then `git diff --exit-code` (sync must be a no-op)
5. installer smoke test into `.ci-skills/`

Actions are pinned to commit SHAs, never moving tags.

## Known gaps

- No eval suite for skill behaviour — the prompts and the process are untested by CI.
- No test for `--all` — not implemented.
- No performance test; both CLIs are O(number of surfaces).
- No concurrency test; the version tool is a single-writer tool by design.

## Reproducing a failure

```bash
node --test tests/version.test.mjs --test-name-pattern="<test name>"
node --test tests/install.test.mjs --test-name-pattern="<test name>"
```

The temp fixtures are deleted after the run. To keep one for inspection, comment out the
`after()` cleanup and re-run.
