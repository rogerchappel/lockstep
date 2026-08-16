# Lockstep Tasks

## MVP complete

- [x] Scaffold StackForge `oss-cli` project from the Lockstep PRD.
- [x] Implement package discovery with conservative ignore rules.
- [x] Read scripts, engines, package manager, and lockfiles from each package.
- [x] Load default or JSON policy files.
- [x] Report required-script, validation-command, Node engine, package-manager, and lockfile drift.
- [x] Render table, JSON, and Markdown output.
- [x] Add `init --write-policy` for policy bootstrapping.
- [x] Add fixture-backed tests for policy, scanning, formatting, and CLI behavior.
- [x] Add docs, examples, security, contribution, and safety posture.

## Next useful work

- [ ] Add ignore globs from the policy file.
- [ ] Add baseline comparison for gradual adoption.
- [ ] Add CSV output for spreadsheet-heavy release rooms.
- [ ] Add richer package-manager lockfile mismatch diagnostics.
- [x] Document GitHub-only installation and guard the private package identity.
