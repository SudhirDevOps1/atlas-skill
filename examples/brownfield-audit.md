# Example — brownfield audit

A real case study: ATLAS applied to this repository. Every number below comes from the
repository itself, not from a mock-up.

---

## 1. The prompt

```text
es pr bhi mere skill apply kro to ye bhi ek project hi hain na
```

## 2. INSPECT — what was actually there

```text
git            clean, 3 commits, main in sync with origin
tracked files  22
runtime        Node 26.13.0, pnpm 12.10.1
product        two text artifacts + one Node script
tests          none
CI             none
memory files   none
version SSOT   none — README said "1.0.0", the tag said "v1.0.0", nothing enforced it
```

## 3. Classify before building

ATLAS picks the mode from evidence, not from ambition:

| Question | Answer | Consequence |
|---|---|---|
| Is this an application? | No — text plus one CLI | No PRD, no design system, no threat model |
| Does it store user data? | No | No database, no auth, no privacy policy |
| Does it deploy a service? | No | No hosting, no rollback plan, no uptime target |
| Does it ship more than once? | Yes | SSOT versioning, changelog, tags |
| Will another agent continue it? | Yes | Memory set, handoff, status doc |

Skipping the first four is the skill working. Producing them would be over-engineering.

## 4. Audit — gaps that matter

| Gap | Why it matters | Fix |
|---|---|---|
| No version source of truth | README, tag and docs can disagree forever | `package.json#version` + `version:sync` |
| No tests | "it works" was an opinion | 15 black-box tests over the real CLI |
| No CI | Nothing stopped a regression | GitHub Actions, Node 20 and 22 |
| No drift gate | A hand-edited badge is invisible | `version:verify` fails the build |
| No memory files | A new session restarts from zero | AGENTS · MEMORY · HANDOFF · TASKS · ASSUMPTIONS |
| No honest status | Readers assume more than exists | `docs/PROJECT-STATUS.md` lists what is not built |

## 5. BUILD — smallest change per gap

One commit for the whole self-management pass, because the pieces only work together:
the tests need the CLI, CI needs the tests, the drift gate needs the SSOT.

```text
package.json          SSOT + scripts, zero dependencies
tests/version.test.mjs  15 cases, black-box through a child process
.github/workflows/ci.yml  syntax, tests, verify, "sync is a no-op"
AGENTS.md MEMORY.md HANDOFF.md TASKS.md ASSUMPTIONS.md
docs/PROJECT-STATUS.md docs/TESTING.md
```

## 6. PROVE — the real output

```text
Command: node --test tests/version.test.mjs
Result:  14 passed, 1 skipped, 0 failed
Env:     Node 26.13.0, Windows 11, 2026-11-24
Skip:    rollback test — Windows does not enforce directory permissions
```

```text
Command: gh run view 45378930334
Result:  success
         verify (node 20)  10s   15 passed, 0 skipped, 0 failed
         verify (node 22)   6s   15 passed, 0 skipped, 0 failed
```

The skipped test ran on Linux, so the gap was closed by CI rather than ignored.

```text
Command: node atlas-project-architect/scripts/version.mjs verify
Result:  OK — 1.0.0 in sync (stable, code 10000900)
```

## 7. A real defect the process caught

The first green run carried a GitHub annotation: `checkout@v4` and `setup-node@v4` target
a deprecated Node 20 runtime. ATLAS's own rule — never trust a moving tag, resolve the
SHA — meant re-resolving `v5` through the API and verifying the commit messages belonged
to the right repositories before pinning.

```text
checkout v5   -> fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09   "backport fixes to releases-v5"
setup-node v5 -> a0853c24544627f65ddf259abe73b1d18a591444   "Bump actions/checkout from 4 to 5"
```

Next run `45379577414`: success, no annotations.

## 8. What ATLAS recorded, and why

| File | Question it answers next session |
|---|---|
| `HANDOFF.md` | What was true at the end of the last session? |
| `MEMORY.md` | Why was it built this way? What failed? |
| `TASKS.md` | What is next, what is blocked, what is proposed? |
| `ASSUMPTIONS.md` | What did we assume, and how would we know it is wrong? |
| `docs/PROJECT-STATUS.md` | What works, what does not, with evidence |
| `CHANGELOG.md` | What changed in each release? |

## 9. The takeover test

A different agent should be able to continue from `HANDOFF.md` alone. That is the
acceptance criterion for this mode — not "the code looks fine".

```text
Read HANDOFF.md
  → current version, what changed, what is broken, next 3 actions
Run the commands it lists
  → same output, or the handoff is wrong
Read TASKS.md
  → continue
```
