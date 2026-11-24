#!/usr/bin/env node
/**
 * ATLAS skill installer — zero dependencies, Node 18+.
 *
 * Copies atlas-project-architect/ into the skills directory an agent reads.
 * It never edits an agent's config and never installs anything else.
 *
 * Usage:
 *   node scripts/install-skill.mjs --list
 *   node scripts/install-skill.mjs --agent cursor --scope project
 *   node scripts/install-skill.mjs --agent claude-code --scope global
 *   node scripts/install-skill.mjs --dest .agents/skills
 *
 * Flags:
 *   --agent <id>      target agent (see --list)
 *   --scope <s>       project | global          (default: project)
 *   --dest <dir>      explicit skills directory; overrides --agent/--scope
 *   --force           replace an existing copy of the skill
 *   --dry-run         print the plan, write nothing
 *   --list            print supported agents and their paths
 *
 * Exit: 0 ok | 1 validation (bad target, existing copy) | 2 usage
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..');
const SKILL_NAME = 'atlas-project-architect';
const SRC = path.join(REPO_ROOT, SKILL_NAME);

/**
 * Project and global skills directories, as documented by each agent.
 * Source: https://github.com/vercel-labs/skills/blob/HEAD/docs/agents.md
 * and https://opencode.ai/docs/skills — verified 2026-11-24.
 */
const AGENTS = {
  'claude-code': { label: 'Claude Code', project: '.claude/skills', global: '.claude/skills' },
  codex: { label: 'Codex', project: '.agents/skills', global: '.agents/skills' },
  cursor: { label: 'Cursor', project: '.agents/skills', global: '.cursor/skills' },
  antigravity: { label: 'Antigravity', project: '.agents/skills', global: '.gemini/config/skills' },
  opencode: { label: 'OpenCode', project: '.agents/skills', global: '.config/opencode/skills' },
  copilot: { label: 'GitHub Copilot', project: '.agents/skills', global: '.copilot/skills' },
  'gemini-cli': { label: 'Gemini CLI', project: '.agents/skills', global: '.gemini/skills' },
  cline: { label: 'Cline', project: '.agents/skills', global: '.agents/skills' },
  roo: { label: 'Roo Code', project: '.roo/skills', global: '.roo/skills' },
  kilo: { label: 'Kilo Code', project: '.agents/skills', global: '.kilo/skills' },
  windsurf: { label: 'Windsurf', project: '.windsurf/skills', global: '.codeium/windsurf/skills' },
  amp: { label: 'Amp', project: '.agents/skills', global: '.config/agents/skills' },
  warp: { label: 'Warp', project: '.agents/skills', global: '.agents/skills' },
  zed: { label: 'Zed', project: '.agents/skills', global: '.agents/skills' },
  droid: { label: 'Droid', project: '.agents/skills', global: '.factory/skills' },
  qwen: { label: 'Qwen Code', project: '.qwen/skills', global: '.qwen/skills' },
  kiro: { label: 'Kiro CLI', project: '.kiro/skills', global: '.kiro/skills' },
  continue: { label: 'Continue', project: '.continue/skills', global: '.continue/skills' },
  openhands: { label: 'OpenHands', project: '.openhands/skills', global: '.openhands/skills' },
  universal: { label: 'Universal (.agents)', project: '.agents/skills', global: '.config/agents/skills' },
};

const VALUE_FLAGS = new Set(['--agent', '--scope', '--dest']);

class Fail extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function parseArgs(argv) {
  const flags = new Set();
  const values = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Fail(2, `Unexpected argument: ${arg}`);
    if (VALUE_FLAGS.has(arg)) {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) {
        throw new Fail(2, `${arg} needs a value`);
      }
      values[arg.slice(2)] = value;
      i++;
    } else if (['--list', '--dry-run', '--force', '--help'].includes(arg)) {
      flags.add(arg);
    } else {
      throw new Fail(2, `Unknown flag: ${arg}`);
    }
  }
  return { flags, values };
}

function usage(code) {
  const out = [
    'ATLAS skill installer',
    '',
    '  node scripts/install-skill.mjs --list',
    '  node scripts/install-skill.mjs --agent <id> [--scope project|global] [--force] [--dry-run]',
    '  node scripts/install-skill.mjs --dest <skills-dir> [--force] [--dry-run]',
    '',
    `Copies ${SKILL_NAME}/ into <skills-dir>/${SKILL_NAME}/.`,
    'Nothing else is written. An existing copy is kept unless --force is passed.',
  ].join('\n');
  (code === 0 ? console.log : console.error)(out);
  process.exit(code);
}

function printAgents() {
  const rows = Object.entries(AGENTS).map(([id, a]) => [id, a.label, a.project, a.global]);
  const head = ['AGENT', 'NAME', 'PROJECT', 'GLOBAL'];
  const width = head.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (cells) => cells.map((c, i) => c.padEnd(width[i])).join('  ').trimEnd();
  console.log(line(head));
  for (const row of rows) console.log(line(row));
  console.log('\nGlobal paths are relative to your home directory.');
}

function resolveSkillsDir(values) {
  if (values.dest) return path.resolve(process.cwd(), values.dest);

  const id = values.agent;
  if (!id) throw new Fail(2, 'Pass --agent <id> or --dest <skills-dir>. Run --list to see agents.');
  const agent = AGENTS[id];
  if (!agent) throw new Fail(2, `Unknown agent "${id}". Run --list to see supported ids.`);

  const scope = values.scope || 'project';
  if (scope !== 'project' && scope !== 'global') {
    throw new Fail(2, `--scope must be "project" or "global", got "${scope}"`);
  }
  return scope === 'global'
    ? path.join(os.homedir(), agent[scope])
    : path.resolve(process.cwd(), agent[scope]);
}

function assertSource() {
  if (!fs.existsSync(path.join(SRC, 'SKILL.md'))) {
    throw new Fail(1, `Skill source not found at ${SRC}. Run this from a full clone of the repository.`);
  }
}

function main() {
  const { flags, values } = parseArgs(process.argv.slice(2));

  if (flags.has('--help')) usage(0);
  if (flags.has('--list')) {
    printAgents();
    return;
  }

  assertSource();
  const skillsDir = resolveSkillsDir(values);
  const target = path.join(skillsDir, SKILL_NAME);
  const force = flags.has('--force');
  const dry = flags.has('--dry-run');

  if (path.resolve(target) === path.resolve(SRC)) {
    throw new Fail(1, 'Target is the source folder. Pick a different skills directory.');
  }

  const exists = fs.existsSync(target);
  if (exists && !force) {
    throw new Fail(
      1,
      `${target} already exists. Re-run with --force to replace it, or delete it yourself.`,
    );
  }

  const verb = exists ? 'replace' : 'install';
  console.log(`${dry ? '[dry-run] would ' : ''}${verb} ${SKILL_NAME}`);
  console.log(`  from: ${SRC}`);
  console.log(`  to:   ${target}`);
  if (dry) return;

  if (exists) fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(skillsDir, { recursive: true });
  fs.cpSync(SRC, target, { recursive: true });

  console.log(`\nDone. ${exists ? 'Replaced' : 'Installed'} ${SKILL_NAME}.`);
  console.log('Open a new agent session so it re-scans the skills directory.');
  console.log('Then ask for a project — the skill triggers on its own.');
}

try {
  main();
} catch (e) {
  if (e instanceof Fail) {
    console.error(`error: ${e.message}`);
    process.exit(e.code);
  }
  console.error(e?.stack || String(e));
  process.exit(1);
}
