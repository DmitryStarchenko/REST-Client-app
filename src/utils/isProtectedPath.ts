export type ProtectedPatternConfig = {
  include: RegExp[];
  exclude?: RegExp[];
};

const defaultConfig: ProtectedPatternConfig = {
  include: [/^\/[A-Za-z-]+\/(client|history|variables)/],
  exclude: [],
};

export function isProtectedPath(
  pathname: string,
  config: ProtectedPatternConfig = defaultConfig,
): boolean {
  const matchesInclude = config.include.some((regex) => regex.test(pathname));
  if (!matchesInclude) return false;

  const matchesExclude = config.exclude?.some((regex) => regex.test(pathname)) ?? false;
  return !matchesExclude;
}
