import { resolve } from 'node:path';
import { analyzePackage } from './drift.js';
import { findPackageJsonFiles } from './fs.js';
import { readPackage } from './package-reader.js';
import type { LockstepPolicy, ScanReport } from './types.js';

export async function scanWorkspace(rootInput: string, policy: LockstepPolicy, now = new Date()): Promise<ScanReport> {
  const root = resolve(rootInput);
  const packageJsonFiles = await findPackageJsonFiles(root);
  const packages = await Promise.all(packageJsonFiles.map((file) => readPackage(root, file)));
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
