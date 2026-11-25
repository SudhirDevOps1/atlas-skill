/**
 * Black-box tests for scripts/install-skill.mjs
 *
 * Every test runs the real CLI as a child process against throwaway
 * directories. No dependencies: node:test + node:assert only.
 *
 * Run: node --test tests/install.test.mjs
 */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..');
const CLI = path.join(REPO, 'scripts', 'install-skill.mjs');

const temps = [];
after(() => {
  for (const dir of temps) fs.rmSync(dir, { recursive: true, force: true });
});

function tmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-install-'));
  temps.push(dir);
  return dir;
}

function run(args, { cwd = REPO, env = {} } = {}) {
  const r = spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  return { code: r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
}

const exists = (...p) => fs.existsSync(path.join(...p));

test('--list prints the verified agent matrix', () => {
  const r = run(['--list']);
  assert.equal(r.code, 0);
  for (const id of ['claude-code', 'codex', 'cursor', 'antigravity', 'opencode', 'copilot', 'windsurf']) {
    assert.match(r.out, new RegExp(`^${id}\\s`, 'm'), `missing ${id}`);
  }
  assert.match(r.out, /\.agents\/skills/);
  assert.match(r.out, /\.gemini\/config\/skills/);
});

test('--dest installs the skill folder and nothing else', () => {
  const dir = tmp();
  const skills = path.join(dir, 'skills');
  const r = run(['--dest', skills]);
  assert.equal(r.code, 0);

  const target = path.join(skills, 'atlas-project-architect');
  assert.ok(exists(target, 'SKILL.md'));
  assert.ok(exists(target, 'references', '00-input-and-modes.md'));
  assert.ok(exists(target, 'assets', 'templates', 'AGENTS.md'));
  assert.ok(exists(target, 'scripts', 'version.mjs'));
  assert.equal(exists(target, 'package.json'), false, 'must not copy the whole repo');
});

test('refuses to overwrite without --force, replaces with it', () => {
  const dir = tmp();
  const skills = path.join(dir, 'skills');
  const target = path.join(skills, 'atlas-project-architect');

  assert.equal(run(['--dest', skills]).code, 0);
  fs.writeFileSync(path.join(target, 'SKILL.md'), 'local edit\n');

  const blocked = run(['--dest', skills]);
  assert.equal(blocked.code, 1);
  assert.match(blocked.out, /already exists/);
  assert.equal(fs.readFileSync(path.join(target, 'SKILL.md'), 'utf8'), 'local edit\n');

  const forced = run(['--dest', skills, '--force']);
  assert.equal(forced.code, 0);
  assert.match(fs.readFileSync(path.join(target, 'SKILL.md'), 'utf8'), /^---\nname: atlas-project-architect/);
});

test('--dry-run writes nothing', () => {
  const dir = tmp();
  const skills = path.join(dir, 'skills');
  const r = run(['--dest', skills, '--dry-run']);
  assert.equal(r.code, 0);
  assert.match(r.out, /\[dry-run\]/);
  assert.equal(fs.existsSync(skills), false);
});

test('project scope resolves against the working directory', () => {
  const dir = tmp();
  const r = run(['--agent', 'cursor', '--scope', 'project'], { cwd: dir });
  assert.equal(r.code, 0);
  assert.ok(exists(dir, '.agents', 'skills', 'atlas-project-architect', 'SKILL.md'));
});

test('global scope resolves against the home directory', () => {
  const dir = tmp();
  const home = path.join(dir, 'home');
  fs.mkdirSync(home);
  const r = run(['--agent', 'claude-code', '--scope', 'global'], {
    env: { HOME: home, USERPROFILE: home },
  });
  assert.equal(r.code, 0);
  assert.ok(exists(home, '.claude', 'skills', 'atlas-project-architect', 'SKILL.md'));
});

test('rejects bad input with usage errors', () => {
  const dir = tmp();
  assert.equal(run([]).code, 2);
  assert.equal(run(['--agent', 'nope']).code, 2);
  assert.equal(run(['--agent', 'cursor', '--scope', 'galactic']).code, 2);
  assert.equal(run(['--agent']).code, 2);
  assert.equal(run(['--dest', dir, '--bogus']).code, 2);
});

test('refuses to install over its own source folder', () => {
  const r = run(['--dest', REPO]);
  assert.equal(r.code, 1);
  assert.match(r.out, /source folder/);
});

test('refuses a destination inside the skill source folder', () => {
  const inside = path.join(REPO, 'atlas-project-architect', 'assets');
  const r = run(['--dest', inside]);
  assert.equal(r.code, 1);
  assert.match(r.out, /inside the skill source folder/);
  assert.equal(exists(inside, 'atlas-project-architect'), false);
});

test('refuses a case-variant path to its own source on Windows', {
  skip:
    process.platform === 'win32'
      ? false
      : 'case-insensitive path comparison only applies on Windows',
}, () => {
  const r = run(['--dest', REPO.toLowerCase(), '--force']);
  assert.equal(r.code, 1);
  assert.match(r.out, /source folder/);
  assert.ok(exists(REPO, 'atlas-project-architect', 'SKILL.md'), 'source must survive');
});
