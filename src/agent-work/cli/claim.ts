import "dotenv/config";
import { parseArgs } from "util";
import { claimJob } from "../services/claim-job";
import { closeAgentWorkDb } from "../db";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      worker: { type: "string" },
      job: { type: "string" },
      task: { type: "string" },
    },
  });

  if (!values.worker) {
    console.error("Usage: npm run agent-work:claim -- --worker <worker-key> [--job <job-key>] [--task <task-key>]");
    process.exit(1);
  }

  try {
    const result = await claimJob(values.worker, values.job, values.task);
    console.log(`Successfully claimed job '${result.jobKey}'${result.taskKey ? ` and task '${result.taskKey}'` : ''}.`);
  } catch (error: any) {
    console.error("Error claiming work:", error.message);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
