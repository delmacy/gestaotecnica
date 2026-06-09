import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getAgentWorkDb } from "../db";
import * as schema from "../schema";
import { eq } from "drizzle-orm";

function getFileHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function importMarkdown(importKey: string, filePaths: string[]) {
  const db = getAgentWorkDb();

  await db.insert(schema.agentMarkdownImports).values({
    importKey,
    sourceGlob: "docs/**",
    status: "started",
  });

  let filesSeen = 0;
  let filesImported = 0;
  let filesSkipped = 0;
  let filesFailed = 0;

  for (const filePath of filePaths) {
    try {
      filesSeen++;
      const fullPath = path.resolve(process.cwd(), filePath);

      let content = "";
      try {
          content = await fs.readFile(fullPath, "utf-8");
      } catch (err) {
          filesFailed++;
          continue;
      }

      const hash = getFileHash(content);

      const [existing] = await db
        .select()
        .from(schema.agentMarkdownSources)
        .where(eq(schema.agentMarkdownSources.sourcePath, filePath))
        .limit(1);

      if (existing) {
        if (existing.sourceHash === hash) {
          filesSkipped++;
          await db
            .update(schema.agentMarkdownSources)
            .set({ lastSeenAt: new Date() })
            .where(eq(schema.agentMarkdownSources.id, existing.id));
          continue;
        } else {
            await db
                .update(schema.agentMarkdownSources)
                .set({
                    sourceHash: hash,
                    lastSeenAt: new Date(),
                    importedStatus: "pending",
                })
                .where(eq(schema.agentMarkdownSources.id, existing.id));
             filesImported++;
             continue;
        }
      }

      let sourceType = "unknown";
      if (filePath.includes("phases/")) sourceType = "phase_doc";
      else if (filePath.includes("planning/")) sourceType = "planning_doc";
      else if (filePath.includes("WORK_BOARD")) sourceType = "work_board";
      else if (filePath.includes("NEXT_PHASE")) sourceType = "next_phase";
      else if (filePath.includes("DECISOES_ATIVAS")) sourceType = "decisions";
      else if (filePath.includes("architecture/")) sourceType = "architecture";

      await db.insert(schema.agentMarkdownSources).values({
        sourcePath: filePath,
        sourceType,
        sourceHash: hash,
        title: path.basename(filePath),
        importedStatus: "pending",
      });

      filesImported++;
    } catch (error) {
      console.error(`Failed to process ${filePath}`, error);
      filesFailed++;
    }
  }

  await db
    .update(schema.agentMarkdownImports)
    .set({
      status: filesFailed > 0 ? "partial" : "completed",
      filesSeen,
      filesImported,
      filesSkipped,
      filesFailed,
      finishedAt: new Date(),
      summary: `Processed ${filesSeen} files: ${filesImported} imported, ${filesSkipped} skipped, ${filesFailed} failed.`,
    })
    .where(eq(schema.agentMarkdownImports.importKey, importKey));

  return { filesSeen, filesImported, filesSkipped, filesFailed };
}
