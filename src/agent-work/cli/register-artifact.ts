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
      type: { type: "string" },
      path: { type: "string" },
      change: { type: "string" },
    },
  });

  if (!values.job || !values.type || !values.path) {
    console.error("Usage: npm run agent-work:register-artifact -- --job <job-key> [--task <task-key>] --type <type> --path <path> [--change <change-type>]");
    process.exit(1);
  }

  try {
    const db = getAgentWorkDb();
    await db.insert(schema.agentWorkArtifacts).values({
      jobKey: values.job,
      taskKey: values.task,
      artifactType: values.type,
      path: values.path,
      changeType: values.change,
    });
    console.log("Artifact recorded successfully.");
  } catch (error: any) {
    console.error("Error registering artifact:", error.message);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
