import { eq, and, isNull, or, inArray, notInArray } from "drizzle-orm";
import { getAgentWorkDb } from "../db";
import * as schema from "../schema";

export async function claimJob(workerKey: string, jobKey?: string, taskKey?: string) {
  const db = getAgentWorkDb();

  const [worker] = await db
    .select()
    .from(schema.julesWorkers)
    .where(eq(schema.julesWorkers.key, workerKey))
    .limit(1);

  if (!worker) {
    throw new Error(`Worker '${workerKey}' not found.`);
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

  if (activeClaims.length >= worker.maxActiveClaims) {
    throw new Error(`Worker '${workerKey}' has reached maximum active claims (${worker.maxActiveClaims}).`);
  }

  let targetJobKey = jobKey;

  if (!targetJobKey) {
    const [availableJob] = await db
      .select()
      .from(schema.agentWorkJobs)
      .where(
        and(
          eq(schema.agentWorkJobs.domainKey, worker.domainKey),
          eq(schema.agentWorkJobs.role, worker.role),
          or(eq(schema.agentWorkJobs.status, "ready"), eq(schema.agentWorkJobs.status, "planned"))
        )
      )
      .limit(1);

    if (!availableJob) {
      throw new Error("No available jobs found for your domain and role.");
    }
    targetJobKey = availableJob.key;
  }

  const [job] = await db
    .select()
    .from(schema.agentWorkJobs)
    .where(eq(schema.agentWorkJobs.key, targetJobKey as string))
    .limit(1);

  if (!job) {
    throw new Error(`Job '${targetJobKey}' not found.`);
  }

  if (job.domainKey !== worker.domainKey || job.role !== worker.role) {
    throw new Error(`Worker cannot claim job '${targetJobKey}'. Mismatch in domain or role.`);
  }

  // Check if job is blocked by uncompleted dependencies
  const jobDeps = await db
    .select()
    .from(schema.agentWorkJobDependencies)
    .where(eq(schema.agentWorkJobDependencies.jobKey, targetJobKey as string));

  if (jobDeps.length > 0) {
      const depJobKeys = jobDeps.map((d: any) => d.dependsOnJobKey);

      const incompleteJobs = await db
        .select()
        .from(schema.agentWorkJobs)
        .where(
             and(
                 inArray(schema.agentWorkJobs.key, depJobKeys),
                 notInArray(schema.agentWorkJobs.status, ["merged", "approved", "done", "skipped", "superseded"])
             )
        );

      if (incompleteJobs.length > 0) {
           throw new Error(`Job '${targetJobKey}' is blocked by incomplete jobs: ${incompleteJobs.map((j: any) => j.key).join(', ')}`);
      }
  }


  const existingJobClaim = await db
    .select()
    .from(schema.agentWorkClaims)
    .where(
      and(
        eq(schema.agentWorkClaims.jobKey, targetJobKey as string),
        isNull(schema.agentWorkClaims.taskKey),
        eq(schema.agentWorkClaims.claimStatus, "active")
      )
    )
    .limit(1);

  if (existingJobClaim.length > 0 && !taskKey && existingJobClaim[0].workerKey !== workerKey) {
     throw new Error(`Job '${targetJobKey}' is already actively claimed by another worker.`);
  }

  if (taskKey) {
      const [task] = await db
        .select()
        .from(schema.agentWorkTasks)
        .where(and(eq(schema.agentWorkTasks.jobKey, targetJobKey as string), eq(schema.agentWorkTasks.key, taskKey)))
        .limit(1);

      if (!task) {
          throw new Error(`Task '${taskKey}' not found in job '${targetJobKey}'.`);
      }

      const taskDeps = await db
        .select()
        .from(schema.agentWorkTaskDependencies)
        .where(and(eq(schema.agentWorkTaskDependencies.jobKey, targetJobKey as string), eq(schema.agentWorkTaskDependencies.taskKey, taskKey)));

      if (taskDeps.length > 0) {
          const depTaskKeys = taskDeps.map((d: any) => d.dependsOnTaskKey);

          const incompleteTasks = await db
            .select()
            .from(schema.agentWorkTasks)
            .where(
                 and(
                     eq(schema.agentWorkTasks.jobKey, targetJobKey as string),
                     inArray(schema.agentWorkTasks.key, depTaskKeys),
                     notInArray(schema.agentWorkTasks.status, ["done", "skipped"])
                 )
            );

          if (incompleteTasks.length > 0) {
               throw new Error(`Task '${taskKey}' is blocked by incomplete tasks: ${incompleteTasks.map((t: any) => t.key).join(', ')}`);
          }
      }

      const existingTaskClaim = await db
        .select()
        .from(schema.agentWorkClaims)
        .where(
          and(
            eq(schema.agentWorkClaims.jobKey, targetJobKey as string),
            eq(schema.agentWorkClaims.taskKey, taskKey),
            eq(schema.agentWorkClaims.claimStatus, "active")
          )
        )
        .limit(1);

      if (existingTaskClaim.length > 0 && existingTaskClaim[0].workerKey !== workerKey) {
         throw new Error(`Task '${taskKey}' is already actively claimed by another worker.`);
      }
  }

  await db.transaction(async (tx: any) => {
    await tx.insert(schema.agentWorkClaims).values({
      jobKey: targetJobKey as string,
      taskKey: taskKey || null,
      workerKey,
      claimStatus: "active",
    });

    if (taskKey) {
      await tx
        .update(schema.agentWorkTasks)
        .set({ status: "claimed", assignedWorkerKey: workerKey, updatedAt: new Date() })
        .where(
            and(
                eq(schema.agentWorkTasks.jobKey, targetJobKey as string),
                eq(schema.agentWorkTasks.key, taskKey)
            )
        );
    } else {
        if (job.status === "planned" || job.status === "ready") {
             await tx
                .update(schema.agentWorkJobs)
                .set({ status: "claimed", assignedTo: workerKey, updatedAt: new Date() })
                .where(eq(schema.agentWorkJobs.key, targetJobKey as string));
        }
    }

    await tx.insert(schema.agentWorkEvents).values({
        jobKey: targetJobKey as string,
        taskKey: taskKey || null,
        eventType: "claimed",
        actorKey: workerKey,
        message: `Claimed ${taskKey ? 'task ' + taskKey : 'job ' + targetJobKey}`,
    });
  });

  return { jobKey: targetJobKey, taskKey };
}
