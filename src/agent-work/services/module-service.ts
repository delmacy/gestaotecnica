import { agentWorkDb } from "../db";
import { agentModules, agentModulePaths } from "../schema";
import { eq } from "drizzle-orm";

export async function registerModule(key: string, classification: string, description?: string) {
  await agentWorkDb.insert(agentModules).values({
    key,
    classification,
    description
  }).onConflictDoNothing();
}

export async function registerModulePath(moduleKey: string, pathPattern: string, ownershipType: string) {
  await agentWorkDb.insert(agentModulePaths).values({
    id: crypto.randomUUID(),
    moduleKey,
    pathPattern,
    ownershipType
  }).onConflictDoNothing();
}
