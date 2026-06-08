import "dotenv/config";
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { getPlatformDb, getRuntimeDb, closeDatabaseConnections } from "../../src/db";
import { eq } from "drizzle-orm";

import { cleanGoldenE2E } from "../../src/scripts/golden-e2e/clean";
import { seedGoldenE2E } from "../../src/scripts/golden-e2e/seed";
import { GOLDEN_E2E } from "../../src/scripts/golden-e2e/constants";

import { organizations, workspaces } from "../../src/db/runtime/schema/workspace";
import { processCandidates } from "../../src/db/platform/schema/candidates";
import { processDefinitions, processInstances, actionExecutions, events } from "../../src/db/runtime/schema/workflow";

import { approveCandidateService } from "../../src/features/builder/candidates/candidates.service";
import { publishApprovedCandidateWithDrizzle } from "../../src/features/builder/candidates/candidate-publisher.repository";
import { startProcessInstance } from "../../src/features/workflow/runtime/runtime.service";
import { advanceStep } from "../../src/features/workflow/runtime/runtime-step.service";

// Mock Authorization Port
const mockAuthPort = {
  isHumanAndAuthorized: async (reviewerId: string, workspaceId: string) => true,
};

// Mock Candidate Repository for approveCandidateService
const mockCandidateRepo = {
  getCandidateById: async (db: any, id: string) => {
     const [candidate] = await db.select().from(processCandidates).where(eq(processCandidates.id, id));
     return candidate || null;
  },
  updateCandidateStatus: async (db: any, id: string, input: any) => {
      await db.update(processCandidates).set(input).where(eq(processCandidates.id, id));
  }
};

let dbPlatform: any;
let dbRuntime: any;

before(async () => {
    dbPlatform = getPlatformDb();
    dbRuntime = getRuntimeDb();
    // Start with a clean slate
    await cleanGoldenE2E(dbPlatform, dbRuntime);
});

after(async () => {
    await cleanGoldenE2E(dbPlatform, dbRuntime);
    await closeDatabaseConnections();
});

test("Seed is idempotent and clean is safe", async () => {
    await seedGoldenE2E(dbPlatform, dbRuntime);
    await seedGoldenE2E(dbPlatform, dbRuntime); // Second time should not duplicate

    const orgs = await dbRuntime.select().from(organizations).where(eq(organizations.key, GOLDEN_E2E.organization.key));
    assert.equal(orgs.length, 1);

    const wrks = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, GOLDEN_E2E.workspace.key));
    assert.equal(wrks.length, 1);
});

test("Workspace isolation prevents data leakage", async () => {
    const mainWorkspace = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, GOLDEN_E2E.workspace.key));
    const controlWorkspace = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, GOLDEN_E2E.controlWorkspace.key));

    assert.equal(mainWorkspace.length, 1);
    assert.equal(controlWorkspace.length, 1);

    const candidatesMain = await dbPlatform.select().from(processCandidates).where(eq(processCandidates.workspaceId, mainWorkspace[0].id));
    const candidatesControl = await dbPlatform.select().from(processCandidates).where(eq(processCandidates.workspaceId, controlWorkspace[0].id));

    assert.equal(candidatesMain.length, 1);
    assert.equal(candidatesControl.length, 0); // Control workspace should not have the main candidate
});

test("Golden E2E: Candidate Lifecycle and Runtime Execution", async () => {
    const mainWorkspace = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, GOLDEN_E2E.workspace.key));
    const workspaceId = mainWorkspace[0].id;

    const candidates = await dbPlatform.select().from(processCandidates).where(eq(processCandidates.workspaceId, workspaceId));
    const candidateId = candidates[0].id;
    const reviewerId = candidates[0].createdById;

    // 1. Approve Candidate
    await approveCandidateService(
        dbPlatform,
        workspaceId,
        candidateId,
        reviewerId,
        "Looks good",
        mockAuthPort,
        mockCandidateRepo
    );

    const approvedCandidate = await mockCandidateRepo.getCandidateById(dbPlatform, candidateId);
    assert.equal(approvedCandidate.status, "approved");

    // 2. Publish Candidate
    const published = await publishApprovedCandidateWithDrizzle(
        dbPlatform,
        workspaceId,
        candidateId,
        reviewerId
    );

    assert.ok(published.processDefinitionId);
    assert.ok(published.processVersionId);

    const publishedCandidate = await mockCandidateRepo.getCandidateById(dbPlatform, candidateId);
    assert.equal(publishedCandidate.status, "published");

    const definitions = await dbRuntime.select().from(processDefinitions).where(eq(processDefinitions.id, published.processDefinitionId));
    assert.equal(definitions[0].sourceCandidateId, candidateId);

    // 3. Create Process Instance
    const instanceResult = await startProcessInstance(dbRuntime, {
        workspaceId,
        processVersionId: published.processVersionId,
        createdById: reviewerId,
        initialPayload: { claim: "Broken device" }
    });

    if (!instanceResult.ok) console.error("Start Instance Error:", (instanceResult as any).error); assert.equal(instanceResult.ok, true);
    if (!instanceResult.ok) return;

    const instanceId = instanceResult.data.id;

    const instanceRecord = await dbRuntime.select().from(processInstances).where(eq(processInstances.id, instanceId));
    assert.equal(instanceRecord[0].status, "active");

    // 4. State Advancement
    const [initialExecution] = await dbRuntime.insert(actionExecutions).values({
        workspaceId,
        instanceId,
        actionKey: "intake",
        status: "pending"
    }).returning();

    // Advance: Intake -> Triage
    const adv1 = await advanceStep(dbRuntime, {
        workspaceId,
        processInstanceId: instanceId,
        actionExecutionId: initialExecution.id,
        actionKey: "intake",
        status: "completed",
        output: { result: "intake done" }
    });
    assert.equal(adv1.ok, true);
    const triageExecutionId = (adv1 as any).data?.executionId;
    assert.ok(triageExecutionId);

    // Advance: Triage -> In Progress
    const adv2 = await advanceStep(dbRuntime, {
        workspaceId,
        processInstanceId: instanceId,
        actionExecutionId: triageExecutionId,
        status: "completed",
    });
    assert.equal(adv2.ok, true);
    const inProgressExecutionId = (adv2 as any).data?.executionId;
    assert.ok(inProgressExecutionId);

    // Advance: In Progress -> Resolved
    const adv3 = await advanceStep(dbRuntime, {
        workspaceId,
        processInstanceId: instanceId,
        actionExecutionId: inProgressExecutionId,
        status: "completed",
    });
    assert.equal(adv3.ok, true);
    const resolvedExecutionId = (adv3 as any).data?.executionId;
    assert.ok(resolvedExecutionId);

    // It reached waiting_customer, so let's advance waiting_customer
    const adv4 = await advanceStep(dbRuntime, {
        workspaceId,
        processInstanceId: instanceId,
        actionExecutionId: resolvedExecutionId,
        status: "completed",
    });
    // This goes back to in_progress. We need to reach the end node or stop the loop here.
    // Actually, to make it reach the end, I'll modify the mock edges in the seed script instead.
    assert.equal(adv4.ok, true);

    // Instance should be completed now because next node was an "end" node.
    const finalInstance = await dbRuntime.select().from(processInstances).where(eq(processInstances.id, instanceId));
    assert.equal(finalInstance[0].status, "completed");

    // Verify Events
    const instanceEvents = await dbRuntime.select().from(events).where(eq(events.instanceId, instanceId));
    assert.ok(instanceEvents.length > 3, "Should have created multiple events");
    const completionEvent = instanceEvents.find((e: any) => e.eventType === "process.completed");
    assert.ok(completionEvent, "Process completed event must exist");

    // Try advancing completed instance
    const invalidAdv = await advanceStep(dbRuntime, {
        workspaceId,
        processInstanceId: instanceId,
        actionExecutionId: resolvedExecutionId,
        status: "completed"
    });
    assert.equal(invalidAdv.ok, false);
});
