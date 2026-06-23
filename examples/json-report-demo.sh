#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$ROOT_DIR/examples/workspace-demo"
OUT_FILE="${TMPDIR:-/tmp}/lockstep-demo-drift.json"

cd "$ROOT_DIR"
npm run build
node dist/src/cli.js scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --format json \
  --output "$OUT_FILE"

test -s "$OUT_FILE"
node --input-type=module - "$OUT_FILE" <<'NODE'
import { readFileSync } from 'node:fs';

const report = JSON.parse(readFileSync(process.argv[2], 'utf8'));
if (!report.summary || report.summary.packageCount < 2) {
  console.error('Expected a summary for the two-package demo workspace');
  process.exit(1);
}
if (!Array.isArray(report.packages) || !report.packages.some((pkg) => pkg.name === '@demo/web')) {
  console.error('Expected the report to include @demo/web drift');
  process.exit(1);
}
NODE

echo "JSON drift report: $OUT_FILE"
