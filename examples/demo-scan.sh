#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKSPACE="$ROOT_DIR/examples/workspace-demo"
OUT_FILE="${TMPDIR:-/tmp}/lockstep-demo-drift.md"

node "$ROOT_DIR/dist/src/cli.js" scan "$WORKSPACE" \
  --policy "$WORKSPACE/lockstep.config.json" \
  --format markdown \
  --output "$OUT_FILE"

echo "Wrote $OUT_FILE"
sed -n '1,120p' "$OUT_FILE"

