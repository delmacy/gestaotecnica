import "dotenv/config";
import { parseArgs } from "util";
import { getAgentWorkDb, closeAgentWorkDb } from "../db";
import * as schema from "../schema";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      worker: { type: "string" },
      job: { type: "string" },
      task: { type: "string" },
      message: { type: "string" },
    },
  });

  if (!values.worker || !values.job || !values.message) {
    console.error("Usage: npm run agent-work:append-event -- --worker <worker-key> --job <job-key> [--task <task-key>] --message <message>");
    process.exit(1);
  }

  try {
    const db = getAgentWorkDb();
    await db.insert(schema.agentWorkEvents).values({
      jobKey: values.job,
      taskKey: values.task,
      actorKey: values.worker,
      message: values.message,
      eventType: "progress",
    });
    console.log("Event recorded successfully.");
  } catch (error: any) {
    console.error("Error appending event:", error.message);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
