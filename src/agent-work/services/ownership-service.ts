export interface OwnershipResult {
  valid: boolean;
  ownedFiles: string[];
  readOnlyViolations: string[];
  forbiddenViolations: string[];
  outsideOwnership: string[];
}

export function evaluatePathOwnership(pkg: any, changedFiles: string[]): OwnershipResult {
  const ownedPaths = (pkg.ownedPaths as string[]) || [];
  const readOnlyPaths = (pkg.readOnlyPaths as string[]) || [];
  const forbiddenPaths = (pkg.forbiddenPaths as string[]) || [];

  const result: OwnershipResult = {
    valid: true,
    ownedFiles: [],
    readOnlyViolations: [],
    forbiddenViolations: [],
    outsideOwnership: []
  };

  const matches = (file: string, pattern: string) => {
    if (pattern.endsWith("/**")) {
      const prefix = pattern.slice(0, -3);
      return file === prefix || file.startsWith(prefix + "/");
    }
    return file === pattern;
  };

  for (const file of changedFiles) {
    const isForbidden = forbiddenPaths.some(p => matches(file, p));
    if (isForbidden) {
      result.forbiddenViolations.push(file);
      result.valid = false;
      continue;
    }

    const isReadOnly = readOnlyPaths.some(p => matches(file, p));
    if (isReadOnly) {
      result.readOnlyViolations.push(file);
      result.valid = false;
      continue;
    }

    const isOwned = ownedPaths.some(p => matches(file, p));
    if (isOwned) {
      result.ownedFiles.push(file);
    } else {
      // Documentation exception removed as per prompt
      result.outsideOwnership.push(file);
      result.valid = false;
    }
  }

  return result;
}
