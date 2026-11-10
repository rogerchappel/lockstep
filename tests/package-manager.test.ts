import { equal } from 'node:assert/strict';
import { test } from 'node:test';
import { isPackageManagerAllowed, packageManagerFamily } from '../src/package-manager.js';

test('parses package manager family', () => {
  equal(packageManagerFamily('pnpm@9.15.0'), 'pnpm');
  equal(packageManagerFamily('npm@10.9.0'), 'npm');
});

test('matches allowed package manager prefixes', () => {
  equal(isPackageManagerAllowed('npm@10.9.0', ['npm@']), true);
  equal(isPackageManagerAllowed('yarn@4.0.0', ['npm@', 'pnpm@']), false);
});

test('preserves malformed and unsupported package manager values for policy checks', () => {
  equal(packageManagerFamily('npm'), 'npm');
  equal(packageManagerFamily('@10.9.0'), '@10.9.0');
  equal(packageManagerFamily('bun@1.2.0'), 'bun');
  equal(isPackageManagerAllowed('npm', ['npm@']), false);
  equal(isPackageManagerAllowed('@10.9.0', ['npm@', 'pnpm@']), false);
  equal(isPackageManagerAllowed('npm@', ['npm@']), true);
  equal(isPackageManagerAllowed('bun@1.2.0', ['npm@', 'pnpm@']), false);
});
