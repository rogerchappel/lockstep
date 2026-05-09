# Lockstep Orchestration

Lockstep is designed for maintainers and agents coordinating release readiness across many sibling packages.

## Workflow

1. Generate or review `lockstep.config.json`.
2. Run `lockstep scan <workspace> --policy lockstep.config.json --format markdown --output DRIFT.md`.
3. Review the suggestions; Lockstep does not mutate packages by default.
4. Fix projects in small commits inside their own repos.
5. Re-run the scan until only accepted warnings remain.
6. In CI, use `--fail-on-drift` when required-script gaps should block a release.

## Agent boundaries

- Read manifests and local lockfiles only.
- Do not execute discovered package scripts during scan.
- Do not post results externally.
- Do not write outside explicitly requested output paths.
- Prefer Markdown reports when handing off to humans.

## Exit behavior

- `scan` exits `0` by default, even when it reports drift.
- `scan --fail-on-drift` exits `1` when error-severity findings exist.
- Warnings remain visible without forcing an all-or-nothing adoption cliff.
