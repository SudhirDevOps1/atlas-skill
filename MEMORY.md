# MEMORY.md — atlas-skill

> Durable project knowledge. Update at each milestone. Never store secrets.

## Overview

Public repository shipping three text artifacts and four CLIs: a master prompt for coding
agents, a paste-ready approval contract, a portable skill that turns "build me this" into a
researched, tested, documented, deployable project, an installer, an agent generator, a
one-project setup tool and an SSOT version tool.

MIT licensed. No runtime, no server, no database, no users.

## Current state

- Version: 1.2.0 (unreleased — branch `fix/p0-hardening`; `v1.1.0` is the last published tag).
- Stage: hardening pass — P0/P1 fixes, docs truth pass, Node 22 floor, Windows CI.
- Last verified tests: 51 passed, 1 skipped, 0 failed (52 total) — Node 26.13.0,
  Windows 11, 2026-11-25.
- Last verified CI: the `v1.1.0` runs are recorded in `docs/PROJECT-STATUS.md`; this branch
  has not been pushed, so its matrix run is pending.

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
| 2026-11-25 | Installer compares real paths, case-insensitively on Windows | a lowercased `--dest` deleted the source folder on a case-insensitive filesystem | string equality on `path.resolve()` |
| 2026-11-25 | Installer copies to a sibling temp dir, then swaps | a failed copy can no longer destroy the previous install | delete-then-copy |
| 2026-11-25 | Version tool scans JSON depth instead of regexing `"version"` | npm's `scripts.version` can precede the root key and was being rewritten instead of the SSOT | first-match regex |
| 2026-11-25 | `versionCode` rejects minor/patch > 99 | the packing formula collided (`1.100.0` and `2.0.0` both mapped to `20000900`) | silently colliding codes |
| 2026-11-25 | Setup merges are BOM-aware and skip no-op writes | PowerShell 5.1 configs start with a BOM; a 0-added merge reformatted and backed up for nothing | strip-and-rewrite |
| 2026-11-25 | Playwright MCP pinned to `0.0.86` and labelled local, not read-only | `@latest` is unpinned supply chain, and the server can click and type | floating `@latest`, "read-only" claim |
| 2026-11-25 | Node floor `>=22`; CI on 22 + 24, Ubuntu + Windows | Node 18/20 are EOL in Nov 2026, and the skipped rollback test needs a Windows job | Node 18/20, Linux-only |
| 2026-11-25 | Backup folder is self-ignoring (`.atlas-setup/.gitignore` = `*`) | backups can contain an existing config with credentials | telling users to remember a `.gitignore` line |

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
- npm reserves `scripts.version` as a lifecycle hook. A `"version"` regex can match it
  before the root key, so `show` reported the wrong version and `set` rewrote the script.
- A lowercased Windows path still resolves to the same folder. Comparing
  `path.resolve()` strings is not enough; `realpathSync.native()` + lowercasing is.
- `JSON.parse` rejects a leading U+FEFF even when the file is valid UTF-8. Read the bytes,
  detect the BOM, parse the remainder, and write the BOM back.
- A merge that adds zero keys still reformats the file unless it returns early. Guard on
  `added === 0`, not on "the serialized output differs".
- `versionCode = major*10000 + minor*100 + patch` needs minor and patch bounded to 0–99,
  otherwise two different versions share a code.

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
  it runs on the Ubuntu CI job.
- Setup is resumable, not transactional: a failure after the first action leaves the
  completed actions in place and prints how to resume. Only the version tool rolls back.

## Dependencies of note

None. Deliberate.

## Next priority

1. A minimal eval harness for skill behaviour: 3–5 prompts, rubric, recorded output.
2. Decide whether `version.mjs` should support `--all`, or keep the per-package guidance.
3. Re-verify agent paths when a vendor changes its documentation; update the date.
