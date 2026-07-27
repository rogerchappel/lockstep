# Configuration

Lockstep policy files are JSON so they can be reviewed easily in release and platform repos.

| Field | Purpose |
| --- | --- |
| `requiredScripts` | Scripts that produce error findings when absent. |
| `optionalScripts` | Documented scripts that may be useful but are not enforced yet. |
| `validationCommands` | Commands maintainers expect to run; Lockstep checks that referenced scripts exist. |
| `requiredEngines.node` | Expected `engines.node` value. |
| `allowedPackageManagers` | Prefixes such as `npm@` or `pnpm@`. |
| `requirePackageManager` | Warn when `packageManager` is missing. |
| `requireLockfile` | Warn when no supported lockfile sits beside `package.json`. |
| `ignoredDirectories` | Extra directory names to skip during discovery. |

`validationCommands` recognizes npm script commands in the forms
`npm <script> [arguments]` and `npm run <script> [arguments]`. For example,
`npm test -- --runInBand` checks for a `test` script, while
`npm run check -- --pretty false` checks for a `check` script. Lockstep only
checks whether the referenced script exists; it does not parse shell quoting,
pipelines, command chains, environment assignments, or npm options placed
before the script name.

Run `lockstep init --write-policy` to create a starter policy.
