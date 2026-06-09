import "dotenv/config";
import { importMarkdown } from "../services/markdown-import";
import { closeAgentWorkDb } from "../db";
import { globSync } from "glob";

async function main() {
  console.log("Starting Markdown Import...");

  const importKey = `import_${Date.now()}`;

  const globPatterns = [
    "docs/00-current/NEXT_PHASE.md",
    "docs/00-current/WORK_BOARD.md",
    "docs/00-current/STATUS_DAS_FASES.md",
    "docs/00-current/DECISOES_ATIVAS.md",
    "docs/phases/*.md",
    "docs/planning/alpha/*.md"
  ];

  let allFiles: string[] = [];

  for (const pattern of globPatterns) {
      try {
          const files = globSync(pattern);
          allFiles = allFiles.concat(files);
      } catch (err) {
          console.warn(`Warning: Could not match glob ${pattern}`);
      }
  }

  allFiles = Array.from(new Set(allFiles));

  try {
    const result = await importMarkdown(importKey, allFiles);
    console.log(`Import complete: ${JSON.stringify(result)}`);
  } catch (error: any) {
    console.error("Error running import:", error.message);
    process.exit(1);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
