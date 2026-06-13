#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatReport } from './format.js';
import { loadPolicy, policyJson } from './policy.js';
import { scanWorkspace } from './scanner.js';
import type { OutputFormat } from './types.js';

export interface ParsedOptions {
  values: Record<string, string | boolean>;
  positionals: string[];
}

export function parseArgs(args: string[]): ParsedOptions {
  const values: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith('--')) {
      positionals.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key === 'write-policy' || key === 'help' || key === 'fail-on-drift' || key === 'fail-on-warnings') {
      values[key] = true;
      continue;
    }
    const next = args[index + 1];
    if (!next || next.startsWith('--')) throw new Error(`Missing value for --${key}`);
    values[key] = next;
    index += 1;
  }
  return { values, positionals };
}

export function help(): string {
  return `lockstep - local-first package script and toolchain drift checker\n\nUsage:\n  lockstep init [--write-policy] [--output lockstep.config.json]\n  lockstep scan <workspace> [--policy lockstep.config.json] [--format table|json|markdown] [--output DRIFT.md] [--fail-on-drift] [--fail-on-warnings]\n\nExamples:\n  lockstep scan /Users/me/Developer --policy lockstep.config.json\n  lockstep init --write-policy\n  lockstep scan . --format markdown --output DRIFT.md\n`;
}

export function parseFormat(value: string | boolean | undefined): OutputFormat {
  const format = value ? String(value) : 'table';
  if (format === 'table' || format === 'json' || format === 'markdown') return format;
  throw new Error(`Unsupported format \"${format}\". Use table, json, or markdown.`);
}

export async function run(argv = process.argv.slice(2)): Promise<number> {
  const [command, ...rest] = argv;
  const parsed = parseArgs(rest);
  if (!command || command === '--help' || command === '-h' || parsed.values.help) {
    process.stdout.write(help());
    return 0;
  }

  if (command === 'init') {
    const output = resolve(String(parsed.values.output ?? 'lockstep.config.json'));
    if (!parsed.values['write-policy']) {
      process.stdout.write(policyJson());
      return 0;
    }
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, policyJson(), 'utf8');
    process.stdout.write(`Wrote ${output}\n`);
    return 0;
  }

  if (command === 'scan') {
    const workspace = parsed.positionals[0];
    if (!workspace) throw new Error('Missing workspace path for scan.');
    const policy = await loadPolicy(parsed.values.policy ? resolve(String(parsed.values.policy)) : undefined);
    const report = await scanWorkspace(workspace, policy);
    const rendered = formatReport(report, parseFormat(parsed.values.format));
    if (parsed.values.output) {
      const output = resolve(String(parsed.values.output));
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, rendered, 'utf8');
    } else {
      process.stdout.write(rendered);
    }
    if (parsed.values['fail-on-drift'] && report.summary.errorCount > 0) return 1;
    if (parsed.values['fail-on-warnings'] && report.summary.findingCount > 0) return 1;
    return 0;
  }

  throw new Error(`Unknown command \"${command}\".\n\n${help()}`);
}

if (isCliEntrypoint(import.meta.url, process.argv[1])) {
  run().then((code) => {
    process.exitCode = code;
  }).catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

function isCliEntrypoint(moduleUrl: string, argvPath: string | undefined): boolean {
  if (!argvPath) return false;

  try {
    return realpathSync(fileURLToPath(moduleUrl)) === realpathSync(argvPath);
  } catch {
    return false;
  }
}
