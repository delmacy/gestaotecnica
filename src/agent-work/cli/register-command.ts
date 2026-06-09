import "dotenv/config";
import { parseArgs } from "util";
import { getAgentWorkDb, closeAgentWorkDb } from "../db";
import * as schema from "../schema";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      job: { type: "string" },
      task: { type: "string" },
      command: { type: "string" },
      status: { type: "string" },
    },
  });

  if (!values.job || !values.command || !values.status) {
    console.error("Usage: npm run agent-work:register-command -- --job <job-key> [--task <task-key>] --command <cmd> --status <status>");
    process.exit(1);
  }

  try {
    const db = getAgentWorkDb();
    await db.insert(schema.agentWorkCommands).values({
      jobKey: values.job,
      taskKey: values.task,
      command: values.command,
      status: values.status,
    });
    console.log("Command recorded successfully.");
  } catch (error: any) {
    console.error("Error registering command:", error.message);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
