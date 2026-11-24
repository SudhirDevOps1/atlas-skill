#!/usr/bin/env node
/**
 * ATLAS project setup — zero dependencies, Node 18+.
 *
 * Installs the ATLAS skill, the 15-role sub-agent team and a READ-ONLY MCP
 * config into ONE target project. It never touches global config, never writes
 * a secret, and never silently replaces an existing file or MCP server.
 *
 * Usage:
 *   node scripts/setup-project.mjs --project <dir>                 # preview only
 *   node scripts/setup-project.mjs --project <dir> --apply         # write
 *   node scripts/setup-project.mjs --project <dir> --apply --force # replace with backup
 *   node scripts/setup-project.mjs --list
 *
 * Flags:
 *   --project <dir>          target project directory (required unless --list/--help)
 *   --hosts <list>           opencode,antigravity (default: both)
 *   --components <list>      skill,agents,mcp (default: all)
 *   --apply                  actually write. Without it the command is a dry-run.
 *   --dry-run                explicit preview (same as the default)
 *   --force                  allow replacing existing skill/agent files (backed up first)
 *   --list                   print paths, endpoints and verification sources
 *   --help
 *
 * Exit: 0 ok | 1 validation/target error | 2 usage
 *
 * Verified sources (2026-11-24):
 *   Skill paths   https://opencode.ai/docs/skills/ and vercel-labs/skills docs/agents.md
 *   OpenCode agents https://opencode.ai/docs/agents/ ( .opencode/agents/<id>.md )
 *   OpenCode MCP  https://opencode.ai/docs/mcp-servers/ ( mcp.servers.<name> )
 *   AG agents     https://antigravity.google/docs/subagents ( .agents/agents/<id>.md )
 *   AG MCP        https://antigravity.google/docs/mcp ( .agents/mcp_config.json, mcpServers )
 *   context7      https://opencode.ai/docs/mcp-servers/
 *   Playwright    docs/SKILL-STACK.md (CLI-verified 2026-11-24)
 *   GitHub        github/github-mcp-server docs/remote-server.md (/readonly endpoint)
 *   Supabase      supabase.com/docs/guides/getting-started/mcp (read_only=true)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const SKILL = path.join(REPO, 'atlas-project-architect');
const SKILL_NAME = 'atlas-project-architect';
const OPENCODE_SCHEMA = 'https://opencode.ai/config.json';

const HOSTS = {
  opencode: {
    label: 'OpenCode',
    skills: '.agents/skills',
    agents: '.opencode/agents',
    config: 'opencode.json',
    jsonc: 'opencode.jsonc',
    rootKey: 'mcp.servers'
  },
  antigravity: {
    label: 'Antigravity',
    skills: '.agents/skills',
    agents: '.agents/agents',
    config: '.agents/mcp_config.json',
    rootKey: 'mcpServers'
  }
};

const COMPONENTS = ['skill', 'agents', 'mcp'];

/**
 * Only public endpoints and commands. No token, PAT, DSN, project ref or OAuth
 * secret is ever written. Read-only is enforced server-side where possible:
 *   GitHub   -> official /readonly endpoint (read tools only)
 *   Supabase -> read_only=true query parameter (read-only Postgres user)
 *   context7 -> documentation lookups only
 *   Playwright -> local browser process, no credentials in config
 */
const MCP = {
  opencode: {
    context7: { type: 'remote', url: 'https://mcp.context7.com/mcp' },
    playwright: { type: 'local', command: ['npx', '-y', '@playwright/mcp@latest'] },
    github: { type: 'remote', url: 'https://api.githubcopilot.com/mcp/readonly' },
    supabase: {
      type: 'remote',
      url: 'https://mcp.supabase.com/mcp?read_only=true&features=database,docs'
    }
  },
  antigravity: {
    context7: { serverUrl: 'https://mcp.context7.com/mcp' },
    playwright: { command: 'npx', args: ['-y', '@playwright/mcp@latest'] },
    github: { serverUrl: 'https://api.githubcopilot.com/mcp/readonly' },
    supabase: {
      serverUrl: 'https://mcp.supabase.com/mcp?read_only=true&features=database,docs'
    }
  }
};

// Patterns that must never appear in a generated config value.
const SECRET_PATTERNS = [
  /\bgh[pousr]_[A-Za-z0-9]{16,}\b/,
  /\bsk-[A-Za-z0-9_-]{16,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /Bearer\s+[A-Za-z0-9._-]{16,}/i,
  /\b[Dd][Aa][Tt][Aa][Bb][Aa][Ss][Ee]_URI\s*[:=]/,
  /\b(?:password|client_secret|api[_-]?key)\s*[:=]\s*["']?[A-Za-z0-9]/i
];

class Fail extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function parseArgs(argv) {
  const values = {};
  const flags = new Set();
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--project' || arg === '--hosts' || arg === '--components') {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) {
        throw new Fail(2, `${arg} needs a value`);
      }
      values[arg.slice(2)] = value;
      i++;
    } else if (['--apply', '--dry-run', '--force', '--list', '--help'].includes(arg)) {
      flags.add(arg);
    } else {
      throw new Fail(2, `Unknown flag: ${arg}`);
    }
  }
  return { flags, values };
}

function usage(code) {
  const text = [
    'ATLAS project setup — skill + 15 agents + read-only MCP config',
    '',
    '  node scripts/setup-project.mjs --project <dir>                  # preview',
    '  node scripts/setup-project.mjs --project <dir> --apply          # write',
    '  node scripts/setup-project.mjs --project <dir> --apply --force  # replace + backup',
    '  node scripts/setup-project.mjs --list',
    '',
    'Default is a dry-run. Writes require --apply. Existing files and MCP servers',
    'are kept unless --force is passed. All replacements are backed up first.',
    'No secret, token, DSN, project ref or OAuth credential is ever written.'
  ].join('\n');
  (code === 0 ? console.log : console.error)(text);
  process.exit(code);
}

function printList() {
  console.log('COMPONENTS');
  for (const c of COMPONENTS) console.log('  ' + c);
  console.log('\nHOST PATHS (relative to --project)');
  for (const [id, h] of Object.entries(HOSTS)) {
    console.log(`  ${id.padEnd(12)} skill=${h.skills}/${SKILL_NAME}  agents=${h.agents}/<id>.md  mcp=${h.config}`);
  }
  console.log('\nREAD-ONLY MCP ENDPOINTS');
  for (const [name, def] of Object.entries(MCP.opencode)) {
    const target = def.url || def.command.join(' ');
    console.log(`  ${name.padEnd(11)} ${target}`);
  }
  console.log('\nVerified 2026-11-24: opencode.ai/docs/mcp-servers, antigravity.google/docs/mcp,');
  console.log('github/github-mcp-server docs/remote-server.md, supabase.com/docs/guides/getting-started/mcp');
}

function parseList(value, allowed, label) {
  const items = value.split(',').map((s) => s.trim()).filter(Boolean);
  if (!items.length) throw new Fail(2, `${label} must not be empty`);
  for (const item of items) {
    if (!allowed.includes(item)) {
      throw new Fail(2, `Unknown ${label} "${item}". Use: ${allowed.join(',')}`);
    }
  }
  return [...new Set(items)];
}

function assertNoSecrets(value, label) {
  if (typeof value === 'string') {
    for (const re of SECRET_PATTERNS) {
      if (re.test(value)) throw new Fail(1, `refusing to write a secret-like value in ${label}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => assertNoSecrets(v, `${label}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) assertNoSecrets(v, `${label}.${k}`);
  }
}

function assertSource() {
  if (!fs.existsSync(path.join(SKILL, 'SKILL.md'))) {
    throw new Fail(1, `Skill source not found at ${SKILL}. Run from a full clone.`);
  }
  for (const host of Object.keys(HOSTS)) {
    const dir = path.join(SKILL, 'agents', host);
    if (!fs.existsSync(dir)) throw new Fail(1, `Generated agents missing at ${dir}. Run node scripts/generate-agents.mjs`);
  }
}

function loadConfig(configPath, label) {
  if (!fs.existsSync(configPath)) return {};
  const raw = fs.readFileSync(configPath, 'utf8');
  let data;
  try {
    data = raw.trim() ? JSON.parse(raw) : {};
  } catch (error) {
    throw new Fail(1, `${label} is not valid strict JSON; merge refused: ${error.message}`);
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Fail(1, `${label} root must be a JSON object; merge refused`);
  }
  return data;
}

/** Supports nested keys such as OpenCode's `mcp.servers`. */
function getContainer(data, rootKey) {
  return rootKey.split('.').reduce((node, key) => (node == null ? undefined : node[key]), data);
}

function setContainer(data, rootKey, value) {
  const keys = rootKey.split('.');
  let node = data;
  for (const key of keys.slice(0, -1)) {
    if (node[key] === undefined) node[key] = {};
    node = node[key];
  }
  node[keys.at(-1)] = value;
}

function assertContainer(data, rootKey, label) {
  let node = data;
  for (const key of rootKey.split('.')) {
    if (node[key] === undefined) return; // a missing container is created by the merge
    if (node[key] === null || typeof node[key] !== 'object' || Array.isArray(node[key])) {
      throw new Fail(1, `${label}: ${rootKey} must be an object; merge refused`);
    }
    node = node[key];
  }
}

/** Validate targets before printing a plan, so a dry-run catches the same errors. */
function preflight(hosts, components, project) {
  if (!components.includes('mcp')) return;
  for (const hostId of hosts) {
    const host = HOSTS[hostId];
    const configPath = path.join(project, host.config);
    if (hostId === 'opencode' && !fs.existsSync(configPath) && fs.existsSync(path.join(project, host.jsonc))) {
      throw new Fail(1, `${host.jsonc} exists. JSONC comments cannot be merged safely; convert it to ${host.config} first.`);
    }
    assertContainer(loadConfig(configPath, host.config), host.rootKey, host.config);
  }
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function makeBackup(target, backups, project, rel) {
  const dest = path.join(backups, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(target, dest, { recursive: true });
  return path.relative(project, dest);
}

function mergeConfig(configPath, additions, rootKey, backups, project, rel, label) {
  const existed = fs.existsSync(configPath);
  const data = loadConfig(configPath, label);
  assertContainer(data, rootKey, label);
  if (!existed && rootKey === 'mcp.servers') data.$schema = OPENCODE_SCHEMA;
  if (!getContainer(data, rootKey)) setContainer(data, rootKey, {});
  const servers = getContainer(data, rootKey);

  let added = 0;
  let kept = 0;
  for (const [name, def] of Object.entries(additions)) {
    assertNoSecrets(def, `${rootKey}.${name}`);
    if (Object.prototype.hasOwnProperty.call(servers, name)) {
      kept++; // never clobber an existing connection or its auth settings
      continue;
    }
    servers[name] = def;
    added++;
  }

  const text = JSON.stringify(data, null, 2) + '\n';
  if (existed && fs.readFileSync(configPath, 'utf8') === text) {
    return { added, kept, backedUp: null, unchanged: true };
  }
  const backedUp = existed ? makeBackup(configPath, backups, project, rel) : null;
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, text, 'utf8');
  return { added, kept, backedUp, unchanged: false };
}

function copyDirectory(src, dest, backups, project, rel, force) {
  if (!fs.existsSync(src)) throw new Fail(1, `Source missing: ${src}`);
  if (fs.existsSync(dest) && !force) return { action: 'KEPT', backedUp: null };
  const backedUp = fs.existsSync(dest) ? makeBackup(dest, backups, project, rel) : null;
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  return { action: backedUp ? 'REPLACED' : 'INSTALLED', backedUp };
}

function copyAgentFiles(srcDir, destDir, backups, project, relRoot, force) {
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.md')).sort();
  let installed = 0;
  let kept = 0;
  let replaced = 0;
  for (const file of files) {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    const content = fs.readFileSync(src, 'utf8');
    if (fs.existsSync(dest) && fs.readFileSync(dest, 'utf8') === content) {
      kept++;
      continue;
    }
    if (fs.existsSync(dest) && !force) {
      kept++;
      continue;
    }
    const existed = fs.existsSync(dest);
    const rel = path.join(relRoot, file);
    if (existed) makeBackup(dest, backups, project, rel);
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(dest, content, 'utf8');
    if (existed) replaced++;
    else installed++;
  }
  return { files: files.length, installed, kept, replaced };
}

function main() {
  const { flags, values } = parseArgs(process.argv.slice(2));
  if (flags.has('--help')) usage(0);
  if (flags.has('--list')) {
    printList();
    return;
  }
  if (!values.project) throw new Fail(2, 'Pass --project <dir>. Use --help for usage.');

  const project = path.resolve(process.cwd(), values.project);
  if (!fs.existsSync(project) || !fs.statSync(project).isDirectory()) {
    throw new Fail(1, `Target project does not exist or is not a directory: ${project}`);
  }
  const insideRepo = path.relative(REPO, project);
  if (!insideRepo || (!insideRepo.startsWith('..') && !path.isAbsolute(insideRepo))) {
    throw new Fail(1, 'Target is the ATLAS source repository (or inside it). Pick a separate project.');
  }

  const hosts = values.hosts ? parseList(values.hosts, Object.keys(HOSTS), '--hosts') : Object.keys(HOSTS);
  const components = values.components
    ? parseList(values.components, COMPONENTS, '--components')
    : [...COMPONENTS];
  const apply = flags.has('--apply');
  const force = flags.has('--force');
  const dry = !apply || flags.has('--dry-run');
  const backups = path.join(project, '.atlas-setup', 'backups', stamp());

  assertSource();
  preflight(hosts, components, project);

  console.log(`${dry ? '[dry-run] PLAN' : 'APPLY'} — ${project}`);
  console.log(`  hosts:      ${hosts.join(', ')}`);
  console.log(`  components: ${components.join(', ')}`);
  console.log(`  force:      ${force ? 'yes (replacements backed up)' : 'no (existing files kept)'}`);
  console.log('');

  const summary = { installed: 0, replaced: 0, kept: 0, added: 0, serversKept: 0, backupDir: null };
  const actions = [];
  const skillPaths = new Set();

  for (const hostId of hosts) {
    const host = HOSTS[hostId];

    if (components.includes('skill') && !skillPaths.has(host.skills)) {
      skillPaths.add(host.skills);
      const dest = path.join(project, host.skills, SKILL_NAME);
      actions.push({ host: hostId, item: `skill -> ${host.skills}/${SKILL_NAME}`, apply: () => {
        const r = copyDirectory(SKILL, dest, backups, project, `${host.skills}/${SKILL_NAME}`, force);
        if (r.action === 'KEPT') summary.kept++;
        else if (r.action === 'REPLACED') { summary.replaced++; summary.backupDir = backups; }
        else summary.installed++;
        return r.action + (r.backedUp ? ` (backup: ${r.backedUp})` : '');
      } });
    }

    if (components.includes('agents')) {
      const srcDir = path.join(SKILL, 'agents', hostId);
      const destDir = path.join(project, host.agents);
      actions.push({ host: hostId, item: `agents -> ${host.agents}/<id>.md`, apply: () => {
        const r = copyAgentFiles(srcDir, destDir, backups, project, host.agents, force);
        summary.installed += r.installed;
        summary.replaced += r.replaced;
        summary.kept += r.kept;
        if (r.replaced) summary.backupDir = backups;
        return `${r.files} files (${r.installed} new, ${r.replaced} replaced, ${r.kept} kept)`;
      } });
    }

    if (components.includes('mcp')) {
      const configPath = path.join(project, host.config);
      actions.push({ host: hostId, item: `mcp -> ${host.config}`, apply: () => {
        const r = mergeConfig(configPath, MCP[hostId], host.rootKey, backups, project, host.config, host.config);
        summary.added += r.added;
        summary.serversKept += r.kept;
        if (r.backedUp) summary.backupDir = backups;
        return `${r.added} read-only servers added, ${r.kept} existing kept${r.unchanged ? ' (unchanged)' : ''}` +
          (r.backedUp ? ` (backup: ${r.backedUp})` : '');
      } });
    }
  }

  for (const action of actions) {
    console.log(`  [${action.host}] ${action.item}`);
    if (!dry) console.log(`      ${action.apply()}`);
  }

  if (dry) {
    console.log('\n[dry-run] Nothing was written. Re-run with --apply to install.');
    return;
  }

  console.log('\nDone.');
  console.log(`  new files:        ${summary.installed}`);
  console.log(`  replaced files:   ${summary.replaced}`);
  console.log(`  kept files:       ${summary.kept}`);
  console.log(`  MCP servers added:${summary.added}`);
  console.log(`  existing servers kept: ${summary.serversKept}`);
  console.log(`  backups:          ${summary.backupDir ? path.relative(project, summary.backupDir) : 'none needed'}`);
  console.log('\nOpen a NEW agent session so the host re-scans skills, agents and MCP.');
  console.log('Authenticate GitHub/Supabase in the host when prompted. No token was written here.');
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
