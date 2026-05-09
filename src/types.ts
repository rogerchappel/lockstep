export type OutputFormat = 'table' | 'json' | 'markdown';

export interface LockstepPolicy {
  requiredScripts: string[];
  optionalScripts: string[];
  validationCommands: string[];
  requiredEngines?: {
    node?: string;
  };
  allowedPackageManagers?: string[];
  requirePackageManager?: boolean;
  requireLockfile?: boolean;
  ignoredDirectories?: string[];
}

export interface PackageRecord {
  name: string;
  version?: string;
  relativePath: string;
  packageJsonPath: string;
  scripts: Record<string, string>;
  engines: Record<string, string>;
  packageManager?: string;
  lockfiles: string[];
  private?: boolean;
}

export type DriftSeverity = 'error' | 'warning' | 'info';

export interface DriftFinding {
  packageName: string;
  packagePath: string;
  category: 'script' | 'engine' | 'packageManager' | 'lockfile' | 'validation';
  severity: DriftSeverity;
  message: string;
  suggestion: string;
}

export interface ScanSummary {
  scannedAt: string;
  root: string;
  packageCount: number;
  findingCount: number;
  errorCount: number;
  warningCount: number;
}

export interface ScanReport {
  summary: ScanSummary;
  packages: PackageRecord[];
  findings: DriftFinding[];
  policy: LockstepPolicy;
}
