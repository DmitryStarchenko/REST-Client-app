export type ProtectedPatternConfig = {
  include: RegExp[];
  exclude?: RegExp[];
};

const defaultConfig: ProtectedPatternConfig = {
  include: [/^\/[a-z][2]\/client/],
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
