#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$ROOT_DIR/examples/workspace-demo"
OUT_DIR="${TMPDIR:-/tmp}/lockstep-remediation-checklist"
JSON_REPORT="$OUT_DIR/drift.json"
CHECKLIST="$OUT_DIR/remediation-checklist.md"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

cd "$ROOT_DIR"
npm run build >/dev/null

node dist/src/cli.js scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --format json \
  --output "$JSON_REPORT"

node --input-type=module - "$JSON_REPORT" "$CHECKLIST" <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs';

const [, , input, output] = process.argv;
const report = JSON.parse(readFileSync(input, 'utf8'));
const findings = report.findings ?? [];
const lines = [
  '# Lockstep Remediation Checklist',
  '',
  `Workspace packages scanned: ${report.summary.packageCount}`,
  `Findings: ${report.summary.findingCount} (${report.summary.errorCount} errors, ${report.summary.warningCount} warnings)`,
  '',
  '## Package fixes',
  ''
];

for (const finding of findings) {
  lines.push(`- [ ] ${finding.packageName} (${finding.category}, ${finding.severity}): ${finding.suggestion}`);
}

lines.push('');
lines.push('Generated from the fixture-backed Lockstep JSON report.');
writeFileSync(output, `${lines.join('\n')}\n`);
NODE

grep -Fq "Missing required script" "$JSON_REPORT"
grep -Fq "@demo/web" "$CHECKLIST"
grep -Fq "Set engines.node to \">=20\"" "$CHECKLIST"
grep -Fq "Declare packageManager" "$CHECKLIST"

echo "JSON drift report: $JSON_REPORT"
echo "Remediation checklist: $CHECKLIST"
