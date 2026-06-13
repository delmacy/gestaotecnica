import { WorkPackage } from "../domain/types";

// Helper to check glob overlap. Simple version handling /**
function pathsOverlap(p1: string, p2: string): boolean {
  if (p1 === p2) return true;

  const match1 = p1.endsWith("/**") ? p1.slice(0, -3) : p1;
  const match2 = p2.endsWith("/**") ? p2.slice(0, -3) : p2;

  if (p1.endsWith("/**") && p2.startsWith(match1)) return true;
  if (p2.endsWith("/**") && p1.startsWith(match2)) return true;
  if (p1.endsWith("/**") && p2.endsWith("/**") && (match1.startsWith(match2) || match2.startsWith(match1))) return true;

  return false;
}

export function validateOwnership(pkg: WorkPackage): boolean {
  const allOwned = pkg.ownedPaths || [];
  const allForbidden = pkg.forbiddenPaths || [];

  for (const owned of allOwned) {
     for(const forbidden of allForbidden) {
       if (pathsOverlap(owned, forbidden)) {
         return false;
       }
     }
  }
  return true;
}

export function classifyCollision(pkg1: WorkPackage, pkg2: WorkPackage): "green" | "yellow" | "red" {
  // Check exact overlap on owned paths
  for (const p1 of pkg1.ownedPaths) {
    for (const p2 of pkg2.ownedPaths) {
       if (pathsOverlap(p1, p2)) return "red";
    }
    for (const f2 of pkg2.forbiddenPaths) {
       if (pathsOverlap(p1, f2)) return "red";
    }
  }

  for (const p2 of pkg2.ownedPaths) {
    for (const f1 of pkg1.forbiddenPaths) {
       if (pathsOverlap(p2, f1)) return "red";
    }
  }

  // Check Schema impacts
  const s1 = pkg1.schemaImpacts || [];
  const s2 = pkg2.schemaImpacts || [];
  for (const imp1 of s1) {
    if (s2.includes(imp1)) return "yellow";
  }

  // Check Contract interactions
  const p1_prod = pkg1.contractsProduced || [];
  const p2_cons = pkg2.contractsConsumed || [];
  for (const p of p1_prod) {
    if (p2_cons.includes(p)) return "yellow";
  }
  const p2_prod = pkg2.contractsProduced || [];
  const p1_cons = pkg1.contractsConsumed || [];
  for (const p of p2_prod) {
    if (p1_cons.includes(p)) return "yellow";
  }

  return "green";
}
