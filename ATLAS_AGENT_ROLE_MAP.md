# ATLAS Agent Role Map

Who does what, from what, and to whom the result goes. This is the human-readable
index of the 15 specialist roles defined in
`atlas-project-architect/agent-roles.json` and documented for the agent in
`atlas-project-architect/references/11-agent-team.md`.

**Truth rule.** A role is a responsibility boundary. Real sub-agent definitions
now exist as generated files for OpenCode and Antigravity, but they are only
*active* after being distributed into a project's host-specific agents folder.
Do not claim an agent is running because its file exists.

## Team

| ID | Owns | Inputs | Output | Handoff to | Default scope |
|---|---|---|---|---|---|
| `ui-ux-designer` | flows, tokens, layout, states | idea, existing UI, PRD | design spec | frontend, React, accessibility | read-only |
| `frontend-engineer` | components, build, state | design spec, stack | changed files + check output | QA, reviewer, docs | write on ask |
| `react-nextjs-engineer` | RSC boundaries, routing, rendering | verified React/Next version | implementation + cache rationale | QA, performance, reviewer | write on ask |
| `animation-engineer` | motion audit, transitions, reduced motion | existing motion, design spec | motion spec + CSS/JS | frontend, accessibility, QA | write on ask |
| `backend-engineer` | handlers, services, workers, validation | contracts, architecture | endpoints/services + tests | API architect, QA, docs | write on ask |
| `api-architect` | contracts, versioning, deprecation | consumers, existing contract | contract diff + breaking verdict | backend, frontend, docs | contract first |
| `database-architect` | schema, indexes, transactions, RLS | DB technology, schema, slow queries | migration plan + rollback SQL | parent (approval), QA, docs | read + plan |
| `security-engineer` | threat model, auth, injection, deps | scope, code, manifests | severity-ranked findings | parent assigns fixes | read-only |
| `qa-engineer` | unit, integration, E2E, console/network | baseline, changed files | commands + real pass/fail | parent Definition of Done | write tests on ask |
| `performance-engineer` | latency, bundle, query plans, Vitals | baseline measurements | bottleneck + measured delta | parent, frontend, DB | measure only |
| `devops-engineer` | CI, containers, hosting, rollback | workflows, deploy config | config + rollback plan | parent gates execution | config on ask |
| `code-reviewer` | correctness, security, scope, evidence | diff + requirement | approve / changes requested | parent decides fixes | read-only |
| `accessibility-engineer` | semantics, keyboard, focus, contrast, motion | rendered UI + markup | WCAG-linked findings | design, frontend, QA | read-only |
| `supply-chain-engineer` | provenance, licences, pins, install scripts | manifests, lockfiles, actions | risk list + remediation | parent decides additions | read-only |
| `docs-engineer` | README, AGENTS, handoff, changelog, contracts | actual files + commands | updated docs + stale list | parent | write on ask |

## Phase to role mapping

| ATLAS phase | Primary roles | Required check |
|---|---|---|
| 0. Input | parent only | input template filled, assumptions recorded |
| 1. Research | parent + `supply-chain-engineer` | dated sources, licences verified |
| 2. Product / architecture | `api-architect`, `database-architect` | ADR + contract recorded |
| 3. Design | `ui-ux-designer`, `accessibility-engineer` | states and a11y risks listed |
| 4. Security | `security-engineer`, `supply-chain-engineer` | findings with file:line |
| 5. Build | `frontend-engineer`, `react-nextjs-engineer`, `animation-engineer`, `backend-engineer`, `devops-engineer` | build/type-check output |
| 6. Test | `qa-engineer`, `accessibility-engineer`, `performance-engineer` | commands + counts |
| 7. Version | `docs-engineer` | `version.mjs verify` passes |
| 8. Ship | `devops-engineer`, `code-reviewer`, `docs-engineer` | rollback plan + approval |
| 9. Continue | `docs-engineer` | stranger can continue |

## Delegation rules

1. Delegate **2–4 roles per task**, never all 15. One-off snippets stay in the parent thread.
2. Send a bounded packet: role, goal, exact file paths, agreed context, constraints,
   expected output headings and the check that defines done. Sub-agents do not see
   the parent chat history.
3. Run in parallel only for independent work. Sequence producer → reviewer → docs.
4. Reports are advice. The parent re-runs claimed commands and decides.
5. On disagreement apply the ATLAS order:
   **safety > correctness > security > maintainability > simplicity > performance > speed > polish**.
6. Record any choice that changes architecture, security, legality, cost or product
   direction in `ASSUMPTIONS.md`.

## Approval boundaries (never delegated away)

Sub-agents may not, on their own: install or remove packages, install skills or
MCP servers, change global config, run migrations or production writes, commit,
push, merge, release, deploy, publish, or contact an external service on the
user's behalf. Those gates belong to the parent and the user.

Review, audit and profiling roles are read-only. Implementation roles use `ask`
(OpenCode) and `sandbox` (Antigravity) so the host still prompts.

## Source files and distribution

```
atlas-project-architect/agent-roles.json              SSOT — 15 roles + 4 permission presets
scripts/generate-agents.mjs                           generator + --check drift gate
atlas-project-architect/agents/opencode/<id>.md       15 generated OpenCode subagents
atlas-project-architect/agents/antigravity/<id>.md    15 generated Antigravity subagents
atlas-project-architect/references/11-agent-team.md   coordinator contract
ATLAS_AGENT_ROLE_MAP.md                               this file
tests/agents.test.mjs                                 9 black-box tests
```

Generated files carry `AUTO-GENERATED — DO NOT EDIT`. Change the JSON, not the
Markdown. A host discovers agents only from `.opencode/agents/` (OpenCode) or
`.agents/agents/` (Antigravity) in the target project; distribution is a
separate, approval-gated step.

## Verification

```
node scripts/generate-agents.mjs --check
node --test tests/agents.test.mjs
node atlas-project-architect/scripts/version.mjs verify
```

Evidence (2026-11-24, `pnpm run verify`): 32 tests, **31 pass / 0 fail / 1 skip**
(the skip is the pre-existing Windows directory-permission test), then
`check OK: 30 agent files match the SSOT (15 roles x 2 hosts)` and
`OK — 1.1.0 in sync (stable, code 10100900)`. `node --check scripts/generate-agents.mjs`
exited 0. A command not run is reported as **NOT RUN**, never as pass.
