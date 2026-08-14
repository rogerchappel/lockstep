#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cd "$repo_root"
npm run build >/dev/null
npm pack --dry-run >/dev/null
npm pack --pack-destination "$tmp" >/dev/null

package_tgz="$(find "$tmp" -maxdepth 1 -name 'rogerchappel-lockstep-*.tgz' -print -quit)"
test -n "$package_tgz"

mkdir -p "$tmp/app"
cd "$tmp/app"
npm init -y >/dev/null
npm install "$package_tgz" >/dev/null

./node_modules/.bin/lockstep --help >/dev/null
package_root="node_modules/@rogerchappel/lockstep"
./node_modules/.bin/lockstep scan "$package_root/examples/workspace-demo" --policy "$package_root/examples/workspace-demo/lockstep.config.json" --format markdown --output "$tmp/report.md"
grep -q 'web' "$tmp/report.md"
grep -q 'check' "$tmp/report.md"

echo 'lockstep package smoke passed'
