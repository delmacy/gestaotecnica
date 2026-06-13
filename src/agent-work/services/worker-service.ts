import { agentWorkDb } from "../db";
import { agentWorkers } from "../schema";

export async function registerWorker(key: string, role: string) {
  await agentWorkDb.insert(agentWorkers).values({
    key,
    role,
    status: "active"
  }).onConflictDoNothing();
}
