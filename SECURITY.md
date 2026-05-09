# Security Policy

Lockstep is a local-first CLI. It should never collect secrets, phone home, or execute scripts discovered during a scan.

## Supported versions

The `main` branch is the active development line until the first tagged release.

## Reporting a vulnerability

Please report security issues privately through GitHub's vulnerability reporting flow when available, or contact the maintainer directly. Do not open a public issue with private manifests, repository paths, tokens, or environment details.

## Data handling expectations

- Lockstep reads `package.json` and nearby lockfiles.
- Lockstep writes only explicit output paths and policy files requested by the user.
- Lockstep redacts nothing from package names or script names in reports, so treat generated reports as potentially sensitive when scanning private workspaces.
- Lockstep does not run package scripts, install dependencies, or contact external services.

## Maintainer response

Security fixes should include a regression test or fixture when practical, a changelog note, and a release checklist entry before publication.
