import { getAgentWorkDb } from "../db";
import { agentExecutionWaves } from "../schema";

export async function createWave(key: string, title: string) {
  await getAgentWorkDb().insert(agentExecutionWaves).values({
    key,
    title,
    status: "planned",
    objective: "Created",
    baseBranch: "main",
    baseSha: "latest",
    integrationBranch: "integration/" + key
  }).onConflictDoNothing();
}
