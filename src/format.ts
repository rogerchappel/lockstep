import type { OutputFormat, ScanReport } from './types.js';

function pad(value: string, length: number): string {
  return value.padEnd(length, ' ');
}

export function formatTable(report: ScanReport): string {
  const rows = report.findings.map((finding) => [finding.severity, finding.category, finding.packagePath, finding.message, finding.suggestion]);
  if (rows.length === 0) {
    return `Lockstep scan: ${report.summary.packageCount} package(s), no drift found.\n`;
  }
  const headers = ['severity', 'category', 'package', 'message', 'suggestion'];
  const widths = headers.map((header, index) => Math.max(header.length, ...rows.map((row) => row[index].length)));
  const lines = [headers.map((header, index) => pad(header, widths[index])).join(' | '), widths.map((width) => '-'.repeat(width)).join('-|-')];
  for (const row of rows) lines.push(row.map((cell, index) => pad(cell, widths[index])).join(' | '));
  return `${lines.join('\n')}\n`;
}

export function formatMarkdown(report: ScanReport): string {
  const lines = [
    '# Lockstep Drift Report',
    '',
    `- Root: \`${report.summary.root}\``,
    `- Packages: ${report.summary.packageCount}`,
    `- Findings: ${report.summary.findingCount} (${report.summary.errorCount} errors, ${report.summary.warningCount} warnings)`,
    '',
    '## Findings',
    ''
  ];

  if (report.findings.length === 0) {
    lines.push('No drift found. Everyone is marching together.');
  } else {
    lines.push('| Severity | Category | Package | Message | Suggestion |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const finding of report.findings) {
      lines.push(`| ${finding.severity} | ${finding.category} | \`${finding.packagePath}\` | ${finding.message} | ${finding.suggestion} |`);
    }
  }

  lines.push('', '## Packages', '');
  lines.push('| Package | Path | Scripts | Engine | Manager | Lockfiles |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const pkg of report.packages) {
    lines.push(`| ${pkg.name} | \`${pkg.relativePath}\` | ${Object.keys(pkg.scripts).sort().join(', ') || '—'} | ${pkg.engines.node ?? '—'} | ${pkg.packageManager ?? '—'} | ${pkg.lockfiles.join(', ') || '—'} |`);
  }

  return `${lines.join('\n')}\n`;
}

export function formatReport(report: ScanReport, format: OutputFormat): string {
  if (format === 'json') return `${JSON.stringify(report, null, 2)}\n`;
  if (format === 'markdown') return formatMarkdown(report);
  return formatTable(report);
}
