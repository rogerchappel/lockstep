export { analyzePackage } from './drift.js';
export { formatReport, formatMarkdown, formatTable } from './format.js';
export { defaultPolicy, loadPolicy, normalizePolicy, policyJson } from './policy.js';
export { scanWorkspace } from './scanner.js';
export type { DriftFinding, LockstepPolicy, OutputFormat, PackageRecord, ScanReport } from './types.js';
