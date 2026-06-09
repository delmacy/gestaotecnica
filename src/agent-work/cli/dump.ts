import "dotenv/config";
import { dumpMarkdown } from "../services/markdown-dump";
import { closeAgentWorkDb } from "../db";

async function main() {
  console.log("Starting Markdown Dump...");

  const dumpKey = `dump_${Date.now()}`;

  try {
    const result = await dumpMarkdown(dumpKey);
    console.log(`Dump complete: ${result.taskBoardPath} and ${result.currentWorkPath}`);
  } catch (error: any) {
    console.error("Error running dump:", error.message);
    process.exit(1);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
