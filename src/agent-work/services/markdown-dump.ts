import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getAgentWorkDb } from "../db";
import * as schema from "../schema";
import { eq, inArray } from "drizzle-orm";

function getFileHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function dumpMarkdown(dumpKey: string) {
  const db = getAgentWorkDb();

  const jobs = await db.select().from(schema.agentWorkJobs);
  const tasks = await db.select().from(schema.agentWorkTasks);
  const boxes = await db.select().from(schema.agentTaskBoxes);
  const domains = await db.select().from(schema.agentDomains);
  const workers = await db.select().from(schema.julesWorkers);
  const claims = await db.select().from(schema.agentWorkClaims).where(eq(schema.agentWorkClaims.claimStatus, "active"));

  const dumpsDir = path.resolve(process.cwd(), "docs/agent-work/dumps");
  await fs.mkdir(dumpsDir, { recursive: true });

  const jobsByStatus = jobs.reduce((acc: any, job: any) => {
    acc[job.status] = acc[job.status] || [];
    acc[job.status].push(job);
    return acc;
  }, {});

  // 1. Generate TASK_BOARD.md
  let taskBoardContent = `# Agent Task Board\n\n`;
  taskBoardContent += `## Active Jobs\n\n`;
  const activeJobs = [...(jobsByStatus["in_progress"] || []), ...(jobsByStatus["claimed"] || []), ...(jobsByStatus["ready"] || [])];

  for (const job of activeJobs) {
    taskBoardContent += `### ${job.key} — ${job.title}\n\n`;
    taskBoardContent += `| Box | Task | Status | Worker |\n`;
    taskBoardContent += `|---|---|---|---|\n`;

    const jobBoxes = boxes.filter((b: any) => b.jobKey === job.key).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    for (const box of jobBoxes) {
        const boxTasks = tasks.filter((t: any) => t.jobKey === job.key && t.boxKey === box.key).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
        for(const task of boxTasks) {
            taskBoardContent += `| ${box.title} | ${task.title} | ${task.status} | ${task.assignedWorkerKey || ''} |\n`;
        }
    }
    taskBoardContent += `\n`;
  }

  // 2. Generate CURRENT_AGENT_WORK.md
  let currentWorkContent = `# Current Agent Work Summary\n\n`;
  currentWorkContent += `- Total Jobs: ${jobs.length}\n`;
  currentWorkContent += `- Total Tasks: ${tasks.length}\n`;
  currentWorkContent += `- Active Claims: ${claims.length}\n`;

  // 3. Generate BLOCKED.md
  let blockedContent = `# Blocked Jobs\n\n`;
  const blockedJobs = jobsByStatus["blocked"] || [];
  for (const job of blockedJobs) {
       blockedContent += `- ${job.key}: ${job.title} (Reason: ${job.blockingReason || 'Unknown'})\n`;
  }

  // 4. Generate READY_FOR_REVIEW.md
  let readyReviewContent = `# Ready for Review\n\n`;
  const readyReviewJobs = jobsByStatus["ready_for_review"] || [];
  for (const job of readyReviewJobs) {
       readyReviewContent += `- ${job.key}: ${job.title} (PR: ${job.githubPr || 'N/A'})\n`;
  }

  // 5. Generate DOMAIN_SUMMARY.md
  let domainSummaryContent = `# Domain Summary\n\n`;
  for (const d of domains) {
       domainSummaryContent += `## ${d.name} (${d.key})\n`;
       const dJobs = jobs.filter((j: any) => j.domainKey === d.key);
       domainSummaryContent += `- Jobs: ${dJobs.length}\n\n`;
  }

  const taskBoardPath = path.join(dumpsDir, "TASK_BOARD.md");
  await fs.writeFile(taskBoardPath, taskBoardContent);

  const currentWorkPath = path.join(dumpsDir, "CURRENT_AGENT_WORK.md");
  await fs.writeFile(currentWorkPath, currentWorkContent);

  const blockedPath = path.join(dumpsDir, "BLOCKED.md");
  await fs.writeFile(blockedPath, blockedContent);

  const readyReviewPath = path.join(dumpsDir, "READY_FOR_REVIEW.md");
  await fs.writeFile(readyReviewPath, readyReviewContent);

  const domainSummaryPath = path.join(dumpsDir, "DOMAIN_SUMMARY.md");
  await fs.writeFile(domainSummaryPath, domainSummaryContent);

  const combinedContent = taskBoardContent + currentWorkContent + blockedContent + readyReviewContent + domainSummaryContent;
  const hash = getFileHash(combinedContent);

  await db.insert(schema.agentWorkDumps).values({
    dumpKey,
    path: dumpsDir,
    summary: `Dumped TASK_BOARD.md, CURRENT_AGENT_WORK.md, BLOCKED.md, READY_FOR_REVIEW.md, DOMAIN_SUMMARY.md`,
    contentHash: hash,
    jobCount: jobs.length,
    taskCount: tasks.length,
    blockedCount: blockedJobs.length,
    readyCount: (jobsByStatus["ready"] || []).length,
  });

  return { taskBoardPath, currentWorkPath };
}
