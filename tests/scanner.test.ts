import { equal, ok } from 'node:assert/strict';
import { test } from 'node:test';
import { loadPolicy } from '../src/policy.js';
import { scanWorkspace } from '../src/scanner.js';

test('scans packages and reports deterministic drift', async () => {
  const policy = await loadPolicy('tests/fixtures/workspace/lockstep.config.json');
  const report = await scanWorkspace('tests/fixtures/workspace', policy, new Date('2026-01-01T00:00:00.000Z'));
  equal(report.summary.packageCount, 3);
  equal(report.packages.some((pkg) => pkg.name === 'ignored-package'), false);
  ok(report.findings.some((finding) => finding.packageName === 'drifty-package' && finding.category === 'script'));
  ok(report.findings.some((finding) => finding.packageName === 'drifty-package' && finding.category === 'packageManager'));
  ok(report.findings.some((finding) => finding.packageName === 'weird-package' && finding.category === 'lockfile'));
});

test('resolves workspace lockfile ownership without hiding independent missing lockfiles', async () => {
  const policy = await loadPolicy('tests/fixtures/lockfile-ownership/lockstep.config.json');
  const report = await scanWorkspace('tests/fixtures/lockfile-ownership', policy, new Date('2026-01-01T00:00:00.000Z'));
  const byName = new Map(report.packages.map((pkg) => [pkg.name, pkg]));

  equal(byName.get('hoisted')?.governingLockfile, 'package-lock.json');
  equal(byName.get('independent')?.governingLockfile, 'tools/independent/pnpm-lock.yaml');
  equal(byName.get('missing')?.governingLockfile, undefined);
  equal(report.findings.some((finding) => finding.packageName === 'hoisted' && finding.category === 'lockfile'), false);
  equal(report.findings.some((finding) => finding.packageName === 'independent' && finding.category === 'lockfile'), false);
  ok(report.findings.some((finding) => finding.packageName === 'missing' && finding.category === 'lockfile'));
});
