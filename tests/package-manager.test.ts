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
