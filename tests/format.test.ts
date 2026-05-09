import { match } from 'node:assert/strict';
import { test } from 'node:test';
import { formatMarkdown, formatTable } from '../src/format.js';
import { defaultPolicy } from '../src/policy.js';
import type { ScanReport } from '../src/types.js';

const report: ScanReport = {
  summary: { scannedAt: '2026-01-01T00:00:00.000Z', root: '/tmp/demo', packageCount: 1, findingCount: 1, errorCount: 1, warningCount: 0 },
  packages: [{ name: 'demo', relativePath: '.', packageJsonPath: '/tmp/demo/package.json', scripts: {}, engines: {}, lockfiles: [] }],
  findings: [{ packageName: 'demo', packagePath: '.', category: 'script', severity: 'error', message: 'Missing required script "test".', suggestion: 'Add it.' }],
  policy: defaultPolicy
};

test('renders markdown report with package inventory', () => {
  match(formatMarkdown(report), /# Lockstep Drift Report/);
  match(formatMarkdown(report), /Package \| Path/);
});

test('renders table report with finding details', () => {
  match(formatTable(report), /severity/);
  match(formatTable(report), /Missing required script/);
});


test('escapes pipe characters in markdown cells', () => {
  const rendered = formatMarkdown({
    ...report,
    packages: [{ ...report.packages[0], name: 'demo|pkg' }],
    findings: [{ ...report.findings[0], message: 'a | b' }]
  });
  match(rendered, /demo\\\|pkg/);
  match(rendered, /a \\\| b/);
});
