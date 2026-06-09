import { eq, inArray, and, isNull } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import * as schema from "../schema";
import { TaskKit } from "../types";

export async function getTaskKit(workerKey: string): Promise<any> {
  const db = getAgentWorkDb();

  const [worker] = await db
    .select()
    .from(schema.julesWorkers)
    .where(eq(schema.julesWorkers.key, workerKey))
    .limit(1);

  if (!worker) {
    throw new Error(`Worker with key '${workerKey}' not found.`);
  }

  const [domain] = await db
    .select()
    .from(schema.agentDomains)
    .where(eq(schema.agentDomains.key, worker.domainKey))
    .limit(1);

  if (!domain) {
    throw new Error(`Domain '${worker.domainKey}' not found for worker '${workerKey}'.`);
  }

  const activeClaims = await db
    .select()
    .from(schema.agentWorkClaims)
    .where(
      and(
        eq(schema.agentWorkClaims.workerKey, workerKey),
        eq(schema.agentWorkClaims.claimStatus, "active")
      )
    );

  const allowedJobStatuses = ["ready", "claimed", "in_progress", "blocked"];

  const relevantJobs = await db
    .select()
    .from(schema.agentWorkJobs)
    .where(
      and(
        eq(schema.agentWorkJobs.domainKey, worker.domainKey),
        eq(schema.agentWorkJobs.role, worker.role),
        inArray(schema.agentWorkJobs.status, allowedJobStatuses)
      )
    );

  const jobKeys = relevantJobs.map((j: any) => j.key);

  const kitJobs: any[] = [];

  if (jobKeys.length > 0) {
    const boxes = await db
      .select()
      .from(schema.agentTaskBoxes)
      .where(inArray(schema.agentTaskBoxes.jobKey, jobKeys));

    const tasks = await db
      .select()
      .from(schema.agentWorkTasks)
      .where(inArray(schema.agentWorkTasks.jobKey, jobKeys));

    const jobDeps = await db
      .select()
      .from(schema.agentWorkJobDependencies)
      .where(inArray(schema.agentWorkJobDependencies.jobKey, jobKeys));

    for (const job of relevantJobs) {
      const jobBoxes = boxes.filter((b: any) => b.jobKey === job.key);
      const jobKitBoxes = jobBoxes.map((box: any) => ({
        box,
        tasks: tasks.filter((t: any) => t.jobKey === job.key && t.boxKey === box.key),
      }));

      const dependencies = jobDeps.filter((d: any) => d.jobKey === job.key);

      kitJobs.push({
        job,
        boxes: jobKitBoxes,
        dependencies,
        allowedPaths: job.allowedPaths,
        forbiddenPaths: job.forbiddenPaths,
        promptSummary: job.promptSummary,
        instructionsMd: job.instructionsMd,
      });
    }
  }

  return {
    worker,
    domain,
    activeClaims,
    jobs: kitJobs,
  };
}
