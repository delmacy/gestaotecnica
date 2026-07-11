export interface BuilderModule {
  href: string;
  label: string;
  icon: any;
  status: string;
}

export function getActiveBuilderSection(
  pathname: string | null,
  activeModules: BuilderModule[]
): BuilderModule | undefined {
  if (!pathname) {
    return undefined;
  }

  // Exact match
  const exactMatch = activeModules.find((m) => m.href === pathname);
  if (exactMatch) {
    return exactMatch;
  }

  // Prefix match (for nested paths), but ignore the root `/builder` match if possible
  // To find the best match, we look for the longest matching href
  let bestMatch: BuilderModule | undefined = undefined;
  let maxMatchLength = 0;

  for (const module of activeModules) {
    // Only consider as a prefix if it starts with the href and is followed by a slash (or is the exact root)
    if (pathname.startsWith(module.href) && pathname.charAt(module.href.length) === "/") {
      if (module.href.length > maxMatchLength) {
        bestMatch = module;
        maxMatchLength = module.href.length;
      }
    }
  }

  return bestMatch;
}
