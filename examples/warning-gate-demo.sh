#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$ROOT_DIR/examples/workspace-demo"
OUT_FILE="${TMPDIR:-/tmp}/lockstep-warning-gate.md"

cd "$ROOT_DIR"
npm run build >/dev/null
node dist/src/cli.js scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --format markdown \
  --output "$OUT_FILE" >/dev/null

test -s "$OUT_FILE"
grep -Fq "@demo/web" "$OUT_FILE"
grep -Fq "packageManager" "$OUT_FILE"

if node dist/src/cli.js scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --fail-on-warnings >/tmp/lockstep-warning-gate.out 2>&1; then
  echo "Expected --fail-on-warnings to fail for the drifting demo workspace" >&2
  exit 1
fi

echo "Warning gate report: $OUT_FILE"
