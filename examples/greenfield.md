# Example — greenfield

What ATLAS does when the repository is empty. Illustrative walkthrough: the project is
invented, the process is the real one. No command output is shown because none was run —
ATLAS never invents evidence.

---

## 1. You say

```text
ye app banao: ek link-in-bio page jisme har link pe click track ho
```

## 2. ATLAS inspects first

```text
INSPECT
  cwd            empty directory
  git            not a repository
  manifests      none
  runtime        node 22, pnpm 10
  existing code  none
```

Then it answers the six input questions it cannot infer — or states them as assumptions
and moves on, which is what happens here.

```text
ASSUMPTIONS
  1. Single user (you), one public page — no multi-tenant signup yet
  2. Analytics = click counts per link, no personal data, no cookies
  3. Free hosting only; no paid service
  4. Mobile-first; the page is opened from a phone 90% of the time
  5. Content edited by editing a config file, not a CMS
```

## 3. It writes a brief before any code

```text
UNDERSTANDING
  One public page listing N links. Every click is counted. Owner sees counts.
  Nothing else.

PROBLEMS SPOTTED
  - "track clicks" needs a decision: server-side count, or a third-party script?
    Third-party = free but sends visitor data to someone else. Server-side = one
    tiny endpoint and a database.
  - No mention of spam. Public click endpoints get bot traffic; counts will be wrong
    unless a filter exists.

REUSE
  - Static hosting (GitHub Pages / Cloudflare Pages) instead of a framework server
  - SQLite (or a hosted Postgres free tier) instead of a queue + warehouse

STACK
  | Layer    | Choice                    | Why                                  |
  |----------|---------------------------|--------------------------------------|
  | Frontend | static HTML + one CSS file| no build step, loads in <100 KB      |
  | Clicks   | one POST endpoint         | 20 lines, no vendor, no visitor data |
  | Storage  | SQLite locally / D1 prod  | one table, no ORM                    |
  | Hosting  | Cloudflare Pages + Worker | free tier, same platform             |

REJECTED
  - Next.js — a build pipeline for one static page
  - Google Analytics — free, but ships visitor data to a third party
  - Postgres + Prisma — a migration system for a single counter table

PRIORITIES
  P0  page renders, links work, click counted, owner can read counts
  P1  bot filter, per-day breakdown
  P2  custom domain, themes

RISKS
  - Free-tier limits change; the plan records the date checked
  - Click counts are approximate by nature; the UI must not imply precision
```

## 4. It plans small slices

```text
PLAN
  1. static page + links + tests          → proves rendering
  2. POST /click + one table + test       → proves counting
  3. GET /stats behind a token + test     → proves reading
  4. deploy + smoke test                  → proves it works outside localhost
  5. version 0.1.0, changelog, handoff
```

Each slice ends with a command and its output. Slice 2 is not "done" because the code
looks right; it is done when the test that increments a counter twice returns `2`.

## 5. What it will refuse to do

- Add auth, a queue, or a dashboard before P0 works.
- Call the free tier "unlimited".
- Ship without a `.gitignore` that excludes `.env` and the local database.
- Claim deploy success without a request to the live URL.

## 6. What the repository looks like afterwards

```text
.
├── public/                 index.html, styles.css
├── src/                    click handler, stats handler
├── tests/                  one test per behaviour
├── scripts/version.mjs     copied from the ATLAS skill
├── AGENTS.md  MEMORY.md  HANDOFF.md  TASKS.md  ASSUMPTIONS.md
├── docs/PROJECT-STATUS.md
├── CHANGELOG.md
└── package.json            version is the only hand-edited version
```

## 7. The evidence block, filled only after running

```text
Command: pnpm test
Result:  <real output>
Env:     Node 22, <os>, <date>
```

If it was not run, the line reads `NOT RUN` and says why. There is no third state.
