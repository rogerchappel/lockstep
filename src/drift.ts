import { isPackageManagerAllowed } from './package-manager.js';
import type { DriftFinding, LockstepPolicy, PackageRecord } from './types.js';

function finding(pkg: PackageRecord, input: Omit<DriftFinding, 'packageName' | 'packagePath'>): DriftFinding {
  return {
    packageName: pkg.name,
    packagePath: pkg.relativePath,
    ...input
  };
}

function npmScriptFromValidationCommand(command: string): string | undefined {
  const match = command.match(/^npm\s+(?:run\s+)?(\S+)(?:\s|$)/);
  return match?.[1];
}

export function analyzePackage(pkg: PackageRecord, policy: LockstepPolicy): DriftFinding[] {
  const findings: DriftFinding[] = [];

  for (const script of policy.requiredScripts) {
    if (!pkg.scripts[script]) {
      findings.push(finding(pkg, {
        category: 'script',
        severity: 'error',
        message: `Missing required script \"${script}\".`,
        suggestion: `Add a deterministic \"${script}\" script to ${pkg.relativePath}/package.json.`
      }));
    }
  }

  for (const command of policy.validationCommands) {
    const script = npmScriptFromValidationCommand(command);
    if (script && !pkg.scripts[script]) {
      findings.push(finding(pkg, {
        category: 'validation',
        severity: 'warning',
        message: `Validation command \"${command}\" cannot run because script \"${script}\" is absent.`,
        suggestion: `Either add script \"${script}\" or remove \"${command}\" from the policy.`
      }));
    }
  }

  const requiredNode = policy.requiredEngines?.node;
  if (requiredNode && pkg.engines.node !== requiredNode) {
    findings.push(finding(pkg, {
      category: 'engine',
      severity: 'warning',
      message: `Node engine is ${pkg.engines.node ? `\"${pkg.engines.node}\"` : 'not declared'}; expected \"${requiredNode}\".`,
      suggestion: `Set engines.node to \"${requiredNode}\" for consistent local and CI behavior.`
    }));
  }

  if (policy.requirePackageManager && !pkg.packageManager) {
    findings.push(finding(pkg, {
      category: 'packageManager',
      severity: 'warning',
      message: 'packageManager is not declared.',
      suggestion: 'Declare packageManager, for example \"npm@10.x\" or \"pnpm@9.x\".'
    }));
  }

  if (pkg.packageManager && policy.allowedPackageManagers?.length) {
    if (!isPackageManagerAllowed(pkg.packageManager, policy.allowedPackageManagers)) {
      findings.push(finding(pkg, {
        category: 'packageManager',
        severity: 'warning',
        message: `packageManager \"${pkg.packageManager}\" is outside policy.`,
        suggestion: `Use one of: ${policy.allowedPackageManagers.join(', ')}.`
      }));
    }
  }

  if (policy.requireLockfile && pkg.lockfiles.length === 0) {
    findings.push(finding(pkg, {
      category: 'lockfile',
      severity: 'warning',
      message: 'No supported lockfile found beside package.json.',
      suggestion: 'Commit a package-manager lockfile for repeatable installs.'
    }));
  }

  return findings;
}
