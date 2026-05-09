# Lockstep PRD

Status: in-progress

## One-liner

Multi-package script and toolchain drift checker.

## Summary

A deterministic CLI that scans many local repos/packages and reports drift in package scripts, engines, lockfiles, and toolchain policy.

## Problem

OSS factories and monorepo-adjacent folders accumulate inconsistent scripts, missing smoke checks, and stale Node/package-manager expectations. Humans need a quick map before release work.

## Target users

Maintainers with many repos, dev productivity teams, agent orchestrators.

## V1 scope

- Discover package.json files under a workspace with ignore rules
- Compare scripts, engines, package managers, lockfile presence, and validation commands
- Emit drift reports in table, JSON, and Markdown
- Support a policy file defining required/optional scripts
- Provide autofix suggestions but no default mutation

## CLI shape

```bash
lockstep scan /Users/me/Developer --policy lockstep.config.json
lockstep init --write-policy
lockstep scan . --format markdown --output DRIFT.md
```

## Non-goals

- No SaaS backend.
- No hidden telemetry.
- No external posting or mutation by default.
- No secret collection beyond explicit, redacted local inputs.

## Differentiation

Unlike dependency updaters, Lockstep focuses on release/check script hygiene and local workspace consistency.

## Safety and privacy

- Local-first by default.
- Explicit opt-in for any external command preview/execution.
- Fixture-backed tests for parsing, reporting, and redaction behavior.
- Clear failure modes and deterministic output suitable for CI.

## Acceptance criteria

- TypeScript CLI scaffolded with StackForge under `/Users/roger/Developer/my-opensource/lockstep`.
- `docs/PRD.md`, `docs/TASKS.md`, `docs/ORCHESTRATION.md`, and `docs/orchestration.json` exist.
- Functional MVP with fixtures and tests.
- `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh` pass where present.
- Public GitHub repository `rogerchappel/lockstep` exists with useful description and topics.
- Branch protection attempted for `main`.

## Source attribution

Original idea based on maintaining many sibling OSS repos in this workspace. No external implementation copied.
