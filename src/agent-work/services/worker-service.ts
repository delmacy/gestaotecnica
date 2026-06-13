import { getAgentWorkDb } from "../db";
import { agentWorkers } from "../schema";

export async function registerWorker(key: string, role: string) {
  await getAgentWorkDb().insert(agentWorkers).values({
    key,
    name: key,
    role,
    status: "active"
  }).onConflictDoNothing();
}
