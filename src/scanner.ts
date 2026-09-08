import { dirname, join, relative, resolve, sep } from 'node:path';
import { analyzePackage } from './drift.js';
import { findPackageJsonFiles } from './fs.js';
import { readPackage } from './package-reader.js';
import type { LockstepPolicy, ScanReport } from './types.js';

export async function scanWorkspace(rootInput: string, policy: LockstepPolicy, now = new Date()): Promise<ScanReport> {
  const root = resolve(rootInput);
  const packageJsonFiles = await findPackageJsonFiles(root, { ignoredDirectories: policy.ignoredDirectories });
  const packages = await Promise.all(packageJsonFiles.map((file) => readPackage(root, file)));
  resolveGoverningLockfiles(root, packages);
  const findings = packages.flatMap((pkg) => analyzePackage(pkg, policy));
  const errorCount = findings.filter((finding) => finding.severity === 'error').length;
  const warningCount = findings.filter((finding) => finding.severity === 'warning').length;

  return {
    summary: {
      scannedAt: now.toISOString(),
      root,
      packageCount: packages.length,
      findingCount: findings.length,
      errorCount,
      warningCount
    },
    packages,
    findings,
    policy
  };
}

function resolveGoverningLockfiles(root: string, packages: ScanReport['packages']): void {
  const byDirectory = new Map(packages.map((pkg) => [dirname(pkg.packageJsonPath), pkg]));

  for (const pkg of packages) {
    const directory = dirname(pkg.packageJsonPath);
    if (pkg.lockfiles.length > 0) {
      pkg.governingLockfile = relative(root, join(directory, pkg.lockfiles[0])) || pkg.lockfiles[0];
      continue;
    }

    let ancestor = dirname(directory);
    while (ancestor.startsWith(root + sep) || ancestor === root) {
      const owner = byDirectory.get(ancestor);
      const packagePath = relative(ancestor, directory).split(sep).join('/');
      if (owner?.lockfiles.length && owner.workspacePatterns?.some((pattern) => workspacePatternMatches(pattern, packagePath))) {
        pkg.governingLockfile = relative(root, join(ancestor, owner.lockfiles[0])) || owner.lockfiles[0];
        break;
      }
      if (ancestor === root) break;
      ancestor = dirname(ancestor);
    }
  }
}

function workspacePatternMatches(pattern: string, packagePath: string): boolean {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\u0000')
    .replace(/\*/g, '[^/]*')
    .replace(/\u0000/g, '.*');
  return new RegExp(`^${escaped.replace(/\/$/, '')}$`).test(packagePath);
}
