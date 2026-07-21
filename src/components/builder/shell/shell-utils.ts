import type React from "react";

export interface BuilderModule {
  href: string;
  label: string;
  icon: React.ElementType;
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

  for (const mod of activeModules) {
    // Only consider as a prefix if it starts with the href and is followed by a slash (or is the exact root)
    if (pathname.startsWith(mod.href) && pathname.charAt(mod.href.length) === "/") {
      if (mod.href.length > maxMatchLength) {
        bestMatch = mod;
        maxMatchLength = mod.href.length;
      }
    }
  }

  return bestMatch;
}
