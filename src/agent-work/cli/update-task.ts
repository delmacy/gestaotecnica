import "dotenv/config";
import { parseArgs } from "util";
import { updateTaskStatus } from "../services/task-status";
import { closeAgentWorkDb } from "../db";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      worker: { type: "string" },
      job: { type: "string" },
      task: { type: "string" },
      status: { type: "string" },
    },
  });

  if (!values.worker || !values.job || !values.task || !values.status) {
    console.error("Usage: npm run agent-work:update-task -- --worker <worker-key> --job <job-key> --task <task-key> --status <status>");
    process.exit(1);
  }

  try {
    await updateTaskStatus(values.worker, values.job, values.task, values.status);
    console.log(`Task '${values.task}' successfully updated to '${values.status}'.`);
  } catch (error: any) {
    console.error("Error updating task:", error.message);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
