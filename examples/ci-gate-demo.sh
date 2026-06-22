#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$ROOT_DIR/examples/workspace-demo"
OUT_FILE="${TMPDIR:-/tmp}/lockstep-ci-gate-drift.md"

rm -f "$OUT_FILE"

echo "== Write a Markdown drift report for release review =="
set +e
node "$ROOT_DIR/dist/src/cli.js" scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --format markdown \
  --output "$OUT_FILE"
REPORT_STATUS=$?
set -e

test -s "$OUT_FILE"
grep -q "@demo/web" "$OUT_FILE"
grep -q "Missing required script" "$OUT_FILE"

echo "Wrote $OUT_FILE"
echo "lockstep scan --format markdown exited with status $REPORT_STATUS"
test "$REPORT_STATUS" -eq 0
sed -n '1,80p' "$OUT_FILE"

echo
echo "== Show the CI gate exit code without stopping the demo =="
set +e
node "$ROOT_DIR/dist/src/cli.js" scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --fail-on-drift
STATUS=$?
set -e

echo "lockstep scan --fail-on-drift exited with status $STATUS"
test "$STATUS" -ne 0
