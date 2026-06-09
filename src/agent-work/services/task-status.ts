import { eq, and } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import * as schema from "../schema";

export async function updateTaskStatus(workerKey: string, jobKey: string, taskKey: string, newStatus: string) {
  const db = getAgentWorkDb();

  const [worker] = await db
    .select()
    .from(schema.julesWorkers)
    .where(eq(schema.julesWorkers.key, workerKey))
    .limit(1);

  if (!worker) {
    throw new Error(`Worker '${workerKey}' not found.`);
  }

  const [task] = await db
    .select()
    .from(schema.agentWorkTasks)
    .where(and(eq(schema.agentWorkTasks.jobKey, jobKey), eq(schema.agentWorkTasks.key, taskKey)))
    .limit(1);

  if (!task) {
    throw new Error(`Task '${taskKey}' not found for job '${jobKey}'.`);
  }

  const validStatuses = ["planned", "ready", "claimed", "in_progress", "blocked", "done", "skipped", "failed"];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status '${newStatus}'. Allowed values: ${validStatuses.join(", ")}`);
  }

  const activeClaim = await db
    .select()
    .from(schema.agentWorkClaims)
    .where(
        and(
            eq(schema.agentWorkClaims.workerKey, workerKey),
            eq(schema.agentWorkClaims.jobKey, jobKey),
            eq(schema.agentWorkClaims.claimStatus, "active")
        )
    )
    .limit(1);

  if (activeClaim.length === 0) {
      throw new Error(`Worker '${workerKey}' does not have an active claim on job '${jobKey}'.`);
  }

  await db.transaction(async (tx: any) => {
    const updateData: any = { status: newStatus, updatedAt: new Date() };

    if (newStatus === "in_progress" && !task.startedAt) {
        updateData.startedAt = new Date();
    }
    if (["done", "skipped", "failed"].includes(newStatus) && !task.finishedAt) {
        updateData.finishedAt = new Date();
    }

    await tx
      .update(schema.agentWorkTasks)
      .set(updateData)
      .where(and(eq(schema.agentWorkTasks.jobKey, jobKey), eq(schema.agentWorkTasks.key, taskKey)));

    await tx.insert(schema.agentWorkEvents).values({
      jobKey,
      taskKey,
      eventType: "task_status_changed",
      actorKey: workerKey,
      message: `Task ${taskKey} status changed to ${newStatus}`,
      payload: { oldStatus: task.status, newStatus },
    });

    if (["done", "skipped"].includes(newStatus)) {
        const allTasks = await tx
            .select()
            .from(schema.agentWorkTasks)
            .where(eq(schema.agentWorkTasks.jobKey, jobKey));

        const boxes = await tx
            .select()
            .from(schema.agentTaskBoxes)
            .where(eq(schema.agentTaskBoxes.jobKey, jobKey));

        let allRequiredDone = true;

        for (const t of allTasks) {
            if (t.key === taskKey) continue;

            const box = boxes.find((b: any) => b.key === t.boxKey);
            if (box && box.isRequired) {
                 if (!["done", "skipped"].includes(t.status)) {
                     allRequiredDone = false;
                     break;
                 }
            }
        }

        if (allRequiredDone) {
            await tx.insert(schema.agentWorkEvents).values({
              jobKey,
              eventType: "ready_for_review",
              actorKey: "system",
              message: `All required tasks completed. Consider transitioning job ${jobKey} to ready_for_review.`,
            });
        }
    }
  });

  return { success: true };
}
