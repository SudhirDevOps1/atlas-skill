# TASKS.md — atlas-skill

## Done

- [x] Master prompt (34 sections + appendix) written and reviewed.
- [x] Skill built: `SKILL.md`, 13 references, 6 templates.
- [x] `version.mjs` implemented and hardened (transactional, BOM-safe, idempotent).
- [x] Manual end-to-end verification of the version tool on Windows.
- [x] Repo created, banner + README + license + `v1.0.0` release.
- [x] Repo put under its own skill: SSOT, 52 tests, CI, memory set.
- [x] CI green on Node 20 and 22 (runs `45378930334`, `45379577414`).
- [x] Actions pinned to `v5` SHAs after the Node 20 runtime deprecation warning.
- [x] Repository made public; all personal/private/no-redistribution wording removed.
- [x] `LICENSE` relicensed to MIT.
- [x] `SECURITY.md` with a private reporting channel.
- [x] `INSTALL.md` covering 20 agents, chat-UI fallback, update, uninstall, troubleshooting.
- [x] `docs/AGENT-COMPATIBILITY.md` with the 60+ agent matrix and sources.
- [x] `scripts/install-skill.mjs` + 8 black-box tests.
- [x] `examples/greenfield.md`, `examples/brownfield-audit.md`.
- [x] `1.1.0` bumped, changelog written, tag and release prepared.
- [x] `1.2.0` hardening pass: P0 installer/version bugs fixed, setup CLI hardened,
      15 new regression tests, Node 22 floor, Ubuntu + Windows CI matrix.

## In progress

- [ ] Confirm the CI matrix for the `fix/p0-hardening` branch is green on Node 22 and 24,
      Ubuntu and Windows (requires a push, which needs approval).
- [ ] Cut the `v1.2.0` tag and release (needs approval; `v1.0.0` and `v1.1.0` stay immutable).

## Pending

- [ ] Minimal eval harness for skill behaviour (3–5 prompts, rubric-based, recorded output).
- [ ] Decide `--all` monorepo support in `version.mjs`: implement it or keep the per-package guidance.
- [ ] Re-verify agent paths against vendor docs before the next release.

## Blocked

| Task | Blocked by | Owner |
|---|---|---|
| none | — | — |

## Proposed (not approved)

| Task | Benefit | Cost | Risk |
|---|---|---|---|
| SHA-256 release checksums | tamper evidence for downloaded artifacts | low | none |
| Light-mode banner variant | better contrast on the light GitHub theme | low | visual drift |
| Split references into per-topic files | smaller context per phase | medium | link churn |

## Acceptance criteria (current milestone)

- [x] `node --test tests/version.test.mjs tests/install.test.mjs tests/agents.test.mjs tests/setup-project.test.mjs` → 51 passed, 1 skipped, 0 failed.
- [x] `node scripts/generate-agents.mjs --check` → 30 files match the SSOT.
- [x] `version:verify` → no drift.
- [x] `sync` twice → no diff.
- [x] CI pins actions to commit SHAs.
- [x] Every install path in the docs cites a source and a date.
- [x] The installer cannot overwrite an existing copy without `--force`, cannot target its
      own source (including a Windows case variant), and cannot write inside it.
- [x] The version tool reads/writes only the top-level `"version"`, rejects unknown flags,
      and refuses minor/patch values that would collide in `versionCode`.
- [x] No personal/private/no-redistribution statement remains in the repository.
- [x] A stranger can continue from `HANDOFF.md` alone.
