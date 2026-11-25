/**
 * Black-box tests for atlas-project-architect/scripts/version.mjs
 *
 * Each test builds a throwaway project in the OS temp directory, runs the real
 * CLI as a child process, and asserts on the resulting files and exit codes.
 * No dependencies: node:test + node:assert only.
 *
 * Run: node --test tests/version.test.mjs
 */
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.resolve(HERE, '..', 'atlas-project-architect', 'scripts', 'version.mjs');

const temps = [];
after(() => {
  for (const dir of temps) fs.rmSync(dir, { recursive: true, force: true });
});

/** Create a temp project from a { relativePath: content } map. */
function fixture(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-ver-'));
  temps.push(dir);
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, 'utf8');
  }
  return dir;
}

/** Run the CLI inside a fixture; returns { code, out }. */
function run(dir, ...args) {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd: dir, encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout || ''}${r.stderr || ''}` };
}

const read = (dir, rel) => fs.readFileSync(path.join(dir, rel), 'utf8');

/** path -> sha1 of every file, for exact before/after comparison. */
function snapshot(dir) {
  const map = {};
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else {
        const rel = path.relative(dir, full).replaceAll('\\', '/');
        map[rel] = crypto.createHash('sha1').update(fs.readFileSync(full)).digest('hex');
      }
    }
  };
  walk(dir);
  return map;
}

const BASE = {
  'package.json': `${JSON.stringify({ name: 'fixture', version: '0.1.0' }, null, 2)}\n`,
  'README.md': '# Fixture\n\n![v](https://img.shields.io/badge/version-0.1.0-blue)\n\n**Version:** 0.1.0\n',
  'CHANGELOG.md': '# Changelog\n\n## [Unreleased]\n\n- init\n',
  'index.html': '<meta name="app-version" content="0.1.0">\n',
  'openapi.yaml': 'openapi: 3.0.0\ninfo:\n  title: F\n  version: 0.1.0\npaths: {}\n',
  'MEMORY.md': '# MEMORY\n\nCurrent version: 0.1.0\n',
  'HANDOFF.md': '# HANDOFF\n\nCurrent version: 0.1.0\n',
  'docs/PROJECT-STATUS.md': '# Status\n\nVersion: 0.1.0\n',
  'docs/GUIDE.md': '---\ntitle: G\nversion: 0.1.0\n---\nbody\n',
  Dockerfile: 'FROM alpine\nLABEL org.opencontainers.image.version="0.1.0"\n',
};

test('show --json reports version, channel and next steps', () => {
  const dir = fixture(BASE);
  const r = run(dir, 'show', '--json');
  assert.equal(r.code, 0);
  const d = JSON.parse(r.out);
  assert.equal(d.version, '0.1.0');
  assert.equal(d.channel, 'stable');
  assert.equal(d.versionCode, 100900);
  assert.equal(d.next.patch, '0.1.1');
  assert.equal(d.next.minor, '0.2.0');
  assert.equal(d.next.alpha, '0.2.0-alpha.1');
});

test('bump patch updates every derived surface', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'bump', 'patch').code, 0);

  assert.match(read(dir, 'package.json'), /"version": "0\.1\.1"/);
  assert.match(read(dir, 'README.md'), /badge\/version-0\.1\.1-blue/);
  assert.match(read(dir, 'README.md'), /\*\*Version:\*\* 0\.1\.1/);
  assert.match(read(dir, 'index.html'), /content="0\.1\.1"/);
  assert.match(read(dir, 'openapi.yaml'), /version: 0\.1\.1/);
  assert.match(read(dir, 'MEMORY.md'), /Current version: 0\.1\.1/);
  assert.match(read(dir, 'HANDOFF.md'), /Current version: 0\.1\.1/);
  assert.match(read(dir, 'docs/PROJECT-STATUS.md'), /Version: 0\.1\.1/);
  assert.match(read(dir, 'docs/GUIDE.md'), /^version: 0\.1\.1$/m);
  assert.match(read(dir, 'Dockerfile'), /image\.version="0\.1\.1"/);
  assert.match(read(dir, 'CHANGELOG.md'), /## \[0\.1\.1\]/);
});

test('versionCode follows the Android formula across channels', () => {
  const dir = fixture(BASE);
  const code = () => JSON.parse(run(dir, 'show', '--json').out).versionCode;

  assert.equal(code(), 100900); // 0.1.0
  assert.equal(run(dir, 'bump', 'alpha').code, 0);
  assert.equal(code(), 200001); // 0.2.0-alpha.1
  assert.equal(run(dir, 'bump', 'prerelease').code, 0);
  assert.equal(code(), 200002); // 0.2.0-alpha.2
  assert.equal(run(dir, 'bump', 'beta').code, 0);
  assert.equal(code(), 200101); // 0.2.0-beta.1
  assert.equal(run(dir, 'bump', 'rc').code, 0);
  assert.equal(code(), 200201); // 0.2.0-rc.1
  assert.equal(run(dir, 'bump', 'stable').code, 0);
  assert.equal(code(), 200900); // 0.2.0
});

test('sync is idempotent', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'sync').code, 0);
  const first = snapshot(dir);
  assert.equal(run(dir, 'sync').code, 0);
  assert.deepEqual(snapshot(dir), first);
});

test('verify passes clean and fails on a hand-edited surface', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'sync').code, 0);
  assert.equal(run(dir, 'verify').code, 0);

  fs.writeFileSync(path.join(dir, 'index.html'), '<meta name="app-version" content="9.9.9">\n');
  const bad = run(dir, 'verify');
  assert.equal(bad.code, 1);
  assert.match(bad.out, /index\.html/);

  assert.equal(run(dir, 'sync').code, 0);
  assert.equal(run(dir, 'verify').code, 0);
});

test('verify --json reports drift as structured data', () => {
  const dir = fixture(BASE);
  run(dir, 'sync');
  fs.writeFileSync(path.join(dir, 'openapi.yaml'), 'openapi: 3.0.0\ninfo:\n  version: 9.9.9\n');
  const r = run(dir, 'verify', '--json');
  assert.equal(r.code, 1);
  const d = JSON.parse(r.out);
  assert.equal(d.ok, false);
  assert.deepEqual(d.drift, ['openapi.yaml']);
});

test('rejects invalid versions and unknown bump types', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'set', '1.2').code, 1);
  assert.equal(run(dir, 'set', 'v1.2.3').code, 1);
  assert.equal(run(dir, 'set', '1.2.3-').code, 1);
  assert.equal(run(dir, 'bump', 'bogus').code, 2);
  assert.equal(run(dir, 'bump').code, 2);
  assert.equal(run(dir, 'nope').code, 2);
});

test('blocks downgrade without the flag', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'set', '0.0.9').code, 1);
  assert.match(read(dir, 'package.json'), /"version": "0\.1\.0"/);
  assert.equal(run(dir, 'set', '0.0.9', '--allow-downgrade').code, 0);
  assert.match(read(dir, 'package.json'), /"version": "0\.0\.9"/);
});

test('--dry-run writes nothing', () => {
  const dir = fixture(BASE);
  run(dir, 'sync');
  const before = snapshot(dir);
  const r = run(dir, 'bump', 'minor', '--dry-run');
  assert.equal(r.code, 0);
  assert.match(r.out, /\[dry-run\]/);
  assert.deepEqual(snapshot(dir), before);
});

test('supports version.json as the SSOT', () => {
  const files = { ...BASE, 'version.json': '{ "version": "2.0.0" }\n' };
  delete files['package.json'];
  const dir = fixture(files);
  assert.equal(run(dir, 'show').code, 0);
  assert.equal(run(dir, 'bump', 'minor').code, 0);
  assert.match(read(dir, 'version.json'), /"version": "2\.1\.0"/);
});

test('does not invent folders the project does not have', () => {
  const dir = fixture({
    'package.json': '{"name":"m","version":"0.1.0"}\n',
    'CHANGELOG.md': '# Changelog\n\n## [Unreleased]\n',
  });
  assert.equal(run(dir, 'sync').code, 0);
  assert.equal(fs.existsSync(path.join(dir, 'src')), false);
  assert.equal(fs.existsSync(path.join(dir, 'public')), false);
});

test('changelog entry lands under Unreleased and is not duplicated', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'bump', 'patch').code, 0);
  const text = read(dir, 'CHANGELOG.md');
  const unreleased = text.indexOf('## [Unreleased]');
  const entry = text.indexOf('## [0.1.1]');
  assert.ok(unreleased > -1 && entry > unreleased, 'new entry must sit below Unreleased');

  assert.equal(run(dir, 'sync').code, 0);
  assert.equal((read(dir, 'CHANGELOG.md').match(/## \[0\.1\.1\]/g) || []).length, 1);
});

test('caps prerelease numbers at 99', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'set', '0.2.0-alpha.99').code, 0);
  assert.equal(run(dir, 'bump', 'prerelease').code, 1);
  assert.equal(run(dir, 'set', '0.2.0-alpha.100').code, 1);
});

test('preserves a UTF-8 BOM in the SSOT', () => {
  const dir = fixture({
    ...BASE,
    'package.json': `\ufeff${JSON.stringify({ version: '0.1.0' }, null, 2)}\n`,
  });
  assert.equal(run(dir, 'bump', 'patch').code, 0);
  const buf = fs.readFileSync(path.join(dir, 'package.json'));
  assert.deepEqual([...buf.subarray(0, 3)], [0xef, 0xbb, 0xbf]);
  assert.match(buf.toString('utf8'), /"version": "0\.1\.1"/);
});

test('reads and writes the top-level version, not scripts.version', () => {
  const dir = fixture({
    'package.json':
      '{\n  "name": "x",\n  "scripts": { "version": "echo 1.2.3" },\n  "version": "0.1.0"\n}\n',
  });

  const shown = run(dir, 'show', '--json');
  assert.equal(shown.code, 0, shown.out);
  assert.equal(JSON.parse(shown.out).version, '0.1.0');

  assert.equal(run(dir, 'set', '0.2.0').code, 0);
  const pkg = JSON.parse(read(dir, 'package.json'));
  assert.equal(pkg.version, '0.2.0');
  assert.equal(pkg.scripts.version, 'echo 1.2.3');
});

test('rejects unknown flags with usage exit 2', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'verify', '--bogus').code, 2);
  assert.equal(run(dir, 'bump', 'patch', '--nope').code, 2);
});

test('rejects minor and patch above 99 to keep versionCode unique', () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'set', '1.100.0').code, 1);
  assert.equal(run(dir, 'set', '1.0.100').code, 1);
});

test('rolls back every written file when a later write fails', {
  skip:
    process.platform === 'win32'
      ? 'directory permissions are not enforced on Windows (verified manually there)'
      : false,
}, () => {
  const dir = fixture(BASE);
  assert.equal(run(dir, 'sync').code, 0);
  const before = snapshot(dir);

  fs.chmodSync(path.join(dir, 'docs'), 0o555);
  try {
    const r = run(dir, 'bump', 'patch');
    assert.equal(r.code, 3);
    assert.deepEqual(snapshot(dir), before, 'SSOT and derived files must be restored');
  } finally {
    fs.chmodSync(path.join(dir, 'docs'), 0o755);
  }
});
