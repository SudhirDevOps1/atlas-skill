# MEMORY.md — atlas-skill

> Durable project knowledge. Update at each milestone. Never store secrets.

## Overview

Public repository shipping two artifacts and one helper: a master prompt for coding
agents, a portable skill that turns "build me this" into a researched, tested,
documented, deployable project, and an installer that puts the skill where an agent
reads it.

MIT licensed. No runtime, no server, no database, no users.

## Current state

- Version: 1.1.0
- Stage: v1.1.0 shipped — public, MIT, installable in 60+ agents.
- Last verified tests: 22 passed, 1 skipped, 0 failed — Node 26.13.0, Windows 11, 2026-11-24.
- Last verified CI: see `docs/PROJECT-STATUS.md`.

## Decisions

| Date | Decision | Why | Alternatives rejected |
|---|---|---|---|
| 2026-11-24 | One `version.mjs` instead of four scripts (`bump`/`set`/`sync`/`verify`) | one contract, one test file, no shared-module duplication | four files as sketched in the master prompt |
| 2026-11-24 | Zero runtime dependencies | near-zero supply-chain risk, runs offline, no lockfile to drift | commander/chalk-style CLI helpers |
| 2026-11-24 | Black-box tests through the real CLI | asserts the user-facing contract, not internals; survives refactors | unit-testing internal functions |
| 2026-11-24 | GitHub Actions pinned to commit SHAs | tags can move; SHAs were resolved via the GitHub API, not memory | `@v4` floating tags |
| 2026-11-24 | No YAML front matter in repo docs | GitHub renders leading `---` visibly; explicit `Version:` lines are cleaner | front-matter versioning in `docs/` |
| 2026-11-24 | Hand-authored SVG banner | exact text, no external asset, no image-generation drift | PNG banner, hosted image |
| 2026-11-24 | Repository goes public under MIT | a skill nobody can install has no value; MIT is the least friction for reuse | proprietary, source-available, Apache-2.0 |
| 2026-11-24 | Installer written in Node, not two shell scripts | one codepath for Windows, macOS and Linux; Node is already required for the version tool | `install.ps1` + `install.sh`, an npx package |
| 2026-11-24 | Installer ships a curated 20-agent registry; docs hold 60+ | `--list` has to stay readable in a terminal | all 60+ agents in the CLI |
| 2026-11-24 | Use only the common skill subset (`name` + `description`) | identical behaviour on every agent; no silent capability differences | `allowed-tools`, hooks, `context: fork` |
| 2026-11-24 | Installer refuses to overwrite without `--force` | never destroy a local edit silently | last-write-wins |
| 2026-11-24 | Copy, never symlink | Windows symlinks need Developer Mode; a copy always works | symlink installs |

## Discoveries

- The maintained agent path table is
  `vercel-labs/skills/docs/agents.md`. Vendor docs drift; record the date checked.
- Cursor's **project** path is `.agents/skills/`; only its **global** path is
  `~/.cursor/skills/`. Assuming symmetry is wrong.
- Roo Code is `.roo/skills/` in both scopes — it is not part of the `.agents/` group.
- Antigravity's global path is `~/.gemini/config/skills/`, not `~/.gemini/skills/`
  (that one belongs to Gemini CLI).
- OpenCode reads `.agents/skills/` and `~/.config/opencode/skills/`, and also has a native
  `.opencode/skills/`. Both work.
- On Windows, `os.homedir()` follows `USERPROFILE`, so a test can redirect "global"
  installs into a temp directory by overriding it.
- Windows: `rename` over a read-only file fails with `EPERM`; antivirus/indexer locks make
  it transient. Retry 5x, then roll back.
- PowerShell 5.1 writes a UTF-8 BOM. Any `^`-anchored regex must run on BOM-stripped text,
  and the BOM must be restored on write.
- shields.io: `-` separates message from colour, so a greedy `[0-9A-Za-z.-]+` eats the
  `-blue` suffix.
- `node --test` skips nothing silently — the skipped rollback test is explicit in output.
- GitHub deprecated the Node 20 runtime for Actions in late 2025; `checkout@v4` /
  `setup-node@v4` trigger a warning. v5 SHAs are current.

## Failed approaches

- Greedy badge regex — destroyed the badge colour on every sync.
- Inserting changelog entries at the first `## ` heading — put releases above `## [Unreleased]`.
- Creating `src/generated/version.ts` unconditionally — polluted projects that have no `src/`.
- Writing the SSOT before planning derived changes — a later failure left a half-applied release.
- Pointing Cursor at `.cursor/rules/*.mdc` — it works, but the rule file is always in
  context and the phase references lose their on-demand loading.
- Listing `--force-channel` and `--no-git` as "every script must support" while the
  bundled script implemented neither — the public flag table now has a `Bundled` column.

## Known issues

- Skill behaviour is prompt-level; no automated eval suite exists.
- `--all` (monorepo iteration) is not implemented in the bundled version tool. The docs
  say to run it per package or use `pnpm -r run version:sync`.
- The installer copies the folder; it does not edit any agent configuration. That is
  deliberate, but it means an agent with a non-standard config needs a manual path.
- The rollback test is skipped on Windows (directory permissions are not enforced there);
  it runs on Linux CI.

## Dependencies of note

None. Deliberate.

## Next priority

1. A minimal eval harness for skill behaviour: 3–5 prompts, rubric, recorded output.
2. Decide whether `version.mjs` should support `--all`, or keep the per-package guidance.
3. Re-verify agent paths when a vendor changes its documentation; update the date.
