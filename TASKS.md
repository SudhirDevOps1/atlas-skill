# TASKS.md — atlas-skill

## Done

- [x] Master prompt (34 sections + appendix) written and reviewed.
- [x] Skill built: `SKILL.md`, 11 references, 6 templates.
- [x] `version.mjs` implemented and hardened (transactional, BOM-safe, idempotent).
- [x] Manual end-to-end verification of the version tool on Windows.
- [x] Repo created, banner + README + license + `v1.0.0` release.
- [x] Repo put under its own skill: SSOT, 15 tests, CI, memory set.
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

## In progress

- [ ] Confirm the CI run for the `v1.1.0` commit is green on Node 20 and 22.

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

- [x] `node --test tests/version.test.mjs tests/install.test.mjs` → 0 failures.
- [x] `version:verify` → no drift.
- [x] `sync` twice → no diff.
- [x] CI pins actions to commit SHAs.
- [x] Every install path in the docs cites a source and a date.
- [x] The installer cannot overwrite an existing copy without `--force`.
- [x] No personal/private/no-redistribution statement remains in the repository.
- [x] A stranger can continue from `HANDOFF.md` alone.
