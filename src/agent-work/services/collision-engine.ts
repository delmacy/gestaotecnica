import { WorkPackage } from "../domain/types";

export function validateOwnership(pkg: WorkPackage): boolean {
  // A simplistic collision check for demonstration.
  // Should reject if it modifies forbidden paths.
  const allOwned = pkg.ownedPaths || [];
  const allForbidden = pkg.forbiddenPaths || [];

  for (const owned of allOwned) {
     for(const forbidden of allForbidden) {
       // if exact match or wildcard match
       if (owned === forbidden || owned.startsWith(forbidden.replace('/**', ''))) {
         return false;
       }
     }
  }

  return true;
}

export function classifyCollision(pkg1: WorkPackage, pkg2: WorkPackage): "green" | "yellow" | "red" {
  // Check exact overlap on owned paths
  for (const p1 of pkg1.ownedPaths) {
    if (pkg2.ownedPaths.includes(p1)) return "red";
    if (pkg2.forbiddenPaths.includes(p1)) return "red";
  }
  for (const p2 of pkg2.ownedPaths) {
    if (pkg1.forbiddenPaths.includes(p2)) return "red";
  }

  // Shared read overlap doesn't collide
  return "green";
}
