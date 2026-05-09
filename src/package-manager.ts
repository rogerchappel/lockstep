export function packageManagerFamily(packageManager: string | undefined): string | undefined {
  if (!packageManager) return undefined;
  const atIndex = packageManager.indexOf('@');
  if (atIndex <= 0) return packageManager;
  return packageManager.slice(0, atIndex);
}

export function isPackageManagerAllowed(packageManager: string | undefined, allowedPrefixes: string[] | undefined): boolean {
  if (!packageManager || !allowedPrefixes?.length) return true;
  return allowedPrefixes.some((prefix) => packageManager.startsWith(prefix));
}
