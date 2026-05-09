const secretPatterns: RegExp[] = [
  /npm_[A-Za-z0-9]{20,}/g,
  /gh[pousr]_[A-Za-z0-9_]{20,}/g,
  /[A-Za-z0-9._%+-]+:[A-Za-z0-9._%+-]+@/g
];

export function redactText(value: string): string {
  return secretPatterns.reduce((current, pattern) => current.replace(pattern, '[REDACTED]'), value);
}
