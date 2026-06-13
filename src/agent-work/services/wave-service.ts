import { agentWorkDb } from "../db";
import { agentExecutionWaves } from "../schema";

export async function createWave(key: string, title: string) {
  await agentWorkDb.insert(agentExecutionWaves).values({
    key,
    title,
    status: "planned"
  }).onConflictDoNothing();
}
