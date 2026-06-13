import { agentWorkDb } from "../db";
import { agentWorkPackages, agentPackageTasks } from "../schema";
import { eq } from "drizzle-orm";
import { WorkPackage } from "../domain/types";

export async function createWorkPackage(pkg: WorkPackage) {
  await agentWorkDb.insert(agentWorkPackages).values(pkg).onConflictDoNothing();
}

export async function addPackageTask(packageKey: string, description: string, order: number) {
  await agentWorkDb.insert(agentPackageTasks).values({
    id: crypto.randomUUID(),
    packageKey,
    description,
    order,
    status: "pending"
  }).onConflictDoNothing();
}

export async function updatePackageStatus(key: string, status: "planned" | "in_progress" | "done" | "blocked") {
  await agentWorkDb.update(agentWorkPackages).set({ status }).where(eq(agentWorkPackages.key, key));
}
