# Lockstep Safety Notes

Lockstep is intentionally read-mostly.

## Non-mutating by default

`lockstep scan` reads package metadata and emits a report. It does not edit manifests, run scripts, install packages, create network requests, or publish results.

## Explicit writes

Only these actions write files:

- `lockstep init --write-policy` writes a policy file.
- `lockstep scan ... --output <path>` writes a rendered report.

## Secret hygiene

Reports may include package names, local paths, script names, engine declarations, and package-manager strings. Review generated reports before sharing them outside your team.
