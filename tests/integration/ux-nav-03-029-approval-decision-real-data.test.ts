import "dotenv/config";
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getRuntimeDb, closeDatabaseConnections } from "../../src/db";
import { serviceOrders, users } from "../../src/db/schema";
import { eq } from "drizzle-orm";
import { getApprovalQueue, getApprovalSummary } from "../../src/modules/approvals/queries";
import { resolveApprovalDecision } from "../../src/modules/approvals/approval-workflow-domain";
import type { WorkspaceContext } from "../../src/platform/workspace";
import {
  ApprovalQueueItemSchema,
  ApprovalSummaryItemSchema,
} from "../../src/modules/approvals/contracts/approval-decision-dto";

const db = getRuntimeDb();
const testServiceOrderId = randomUUID();
const testUserId = randomUUID();
const testCode = `SO-E2E-029-${randomUUID().slice(0, 8)}`;

after(async () => {
  await db.delete(serviceOrders).where(eq(serviceOrders.id, testServiceOrderId));
  await db.delete(users).where(eq(users.id, testUserId));
  await new Promise((resolve) => setTimeout(resolve, 50));
  await closeDatabaseConnections();
});

test("UX-NAV-03-029: Real-data journey validation for approval decision", async (t) => {
  await t.test("inserts a waiting_review service order for real-data validation", async () => {
    await db.insert(users).values({
      id: testUserId,
      name: "Approver E2E 029",
      email: `approver-029-${randomUUID()}@example.com`,
      status: "active",
      accessProfile: "operador"
    });
    await db.insert(serviceOrders).values({
      id: testServiceOrderId,
      code: testCode,
      title: "Revisao tecnica - OS de validacao E2E",
      objective: "Validar percurso real de aprovacao com dados persistidos",
      status: "waiting_review",
      priority: "medium",
      type: "manutencao",
    });

    const [row] = await db
      .select()
      .from(serviceOrders)
      .where(eq(serviceOrders.id, testServiceOrderId))
      .limit(1);

    assert.ok(row, "Service order should be persisted in the database");
    assert.equal(row.code, testCode);
    assert.equal(row.status, "waiting_review");
  });

  await t.test("getApprovalQueue returns the waiting_review service order, readable by /approvals page", async () => {
    const queue = await getApprovalQueue();
    const found = queue.find((item: unknown) => {
      const i = item as { id: string };
      return i.id === testServiceOrderId;
    });

    assert.ok(found, "Service order should appear in the approval queue consumed by GET /approvals");
    assert.equal((found as { code: string }).code, testCode);
    assert.equal((found as { status: string }).status, "waiting_review");

    const parsed = ApprovalQueueItemSchema.safeParse(found);
    assert.ok(parsed.success, "Queue item must conform to the ApprovalQueueItem contract");
  });

  await t.test("getApprovalSummary reflects the waiting_review service order on the /approvals summary cards", async () => {
    const summary = await getApprovalSummary();
    assert.ok(Array.isArray(summary), "Summary should be an array of ApprovalSummaryItem");

    const parsed = ApprovalSummaryItemSchema.array().safeParse(summary);
    assert.ok(parsed.success, "Summary items must conform to the ApprovalSummaryItem contract");

    const emRevisao = summary.find((item: unknown) => {
      const i = item as { label: string };
      return i.label === "Em revisao";
    });
    assert.ok(emRevisao, "Summary must include an 'Em revisao' card");
    assert.ok(
      (emRevisao as { value: number }).value >= 1,
      "Summary must reflect at least 1 waiting_review OS (the one inserted by this test)"
    );
  });

  await t.test("resolveApprovalDecision approves a waiting_review OS with correct actor tracking", () => {
    const context: WorkspaceContext = {
      workspaceId: "test-ws-029",
      workspaceKey: "test-ws-key-029",
      actor: { type: "user", id: testUserId },
      source: "integration",
      environmentMode: "real",
      enabledModules: ["approvals", "service-orders"],
      scopes: ["*"],
      correlationId: `corr-029-${randomUUID()}`,
    };

    const result = resolveApprovalDecision("waiting_review", "approve", context);

    assert.equal(result.status, "approved");
    assert.ok(result.approvedAt instanceof Date, "approvedAt must be a Date");
    assert.equal(result.approvedById, testUserId, "approvedById must match the acting user");
    assert.ok(result.updatedAt instanceof Date, "updatedAt must be a Date");
  });

  await t.test("reject returns the OS to open status with cleared approval fields", () => {
    const context: WorkspaceContext = {
      workspaceId: "test-ws-029",
      workspaceKey: "test-ws-key-029",
      actor: { type: "user", id: testUserId },
      source: "integration",
      environmentMode: "real",
      enabledModules: ["approvals", "service-orders"],
      scopes: ["*"],
      correlationId: `corr-029-${randomUUID()}`,
    };

    const result = resolveApprovalDecision("waiting_review", "reject", context);

    assert.equal(result.status, "open");
    assert.equal(result.approvedAt, undefined, "approvedAt must be cleared on rejection");
    assert.equal(result.approvedById, undefined, "approvedById must be cleared on rejection");
  });

  await t.test("persisting the approval decision removes the OS from the queue", async () => {
    const context: WorkspaceContext = {
      workspaceId: "test-ws-029",
      workspaceKey: "test-ws-key-029",
      actor: { type: "user", id: testUserId },
      source: "integration",
      environmentMode: "real",
      enabledModules: ["approvals", "service-orders"],
      scopes: ["*"],
      correlationId: `corr-029-persist-${randomUUID()}`,
    };

    const decision = resolveApprovalDecision("waiting_review", "approve", context);

    const [updated] = await db
      .update(serviceOrders)
      .set({
        status: decision.status,
        approvedAt: decision.approvedAt,
        approvedById: decision.approvedById,
        updatedAt: decision.updatedAt,
      })
      .where(eq(serviceOrders.id, testServiceOrderId))
      .returning({
        id: serviceOrders.id,
        status: serviceOrders.status,
        approvedAt: serviceOrders.approvedAt,
        approvedById: serviceOrders.approvedById,
      });

    assert.equal(updated.status, "approved");
    assert.ok(updated.approvedAt instanceof Date, "approvedAt must be persisted");
    assert.equal(updated.approvedById, testUserId);

    const queueAfterApproval = await getApprovalQueue();
    const stillInQueue = queueAfterApproval.find((item: unknown) => {
      const i = item as { id: string };
      return i.id === testServiceOrderId;
    });
    assert.equal(
      stillInQueue,
      undefined,
      "Approved service order must no longer appear in the approval queue"
    );
  });

  await t.test("approval-decision-dto contracts validate queue items and summary items", () => {
    const validItem = {
      id: testServiceOrderId,
      code: testCode,
      title: "Validacao de contrato",
      objective: "Teste",
      status: "waiting_review",
      priority: "medium",
      completedAt: null,
      createdAt: new Date(),
      workItemId: null,
      workItemTitle: null,
      assetId: null,
      assetCode: null,
      assetName: null,
    };

    assert.ok(ApprovalQueueItemSchema.safeParse(validItem).success, "Valid queue item must pass schema");

    const validSummary = { label: "Em revisao", value: 1 };
    assert.ok(ApprovalSummaryItemSchema.safeParse(validSummary).success, "Valid summary item must pass schema");
  });

  await t.test("workspace context types are preserved through the domain", () => {
    const systemContext: WorkspaceContext = {
      workspaceId: "test-ws-029",
      workspaceKey: "test-ws-key-029",
      actor: { type: "system" },
      source: "integration",
      environmentMode: "real",
      enabledModules: ["approvals", "service-orders"],
      scopes: ["*"],
      correlationId: `corr-029-system-${randomUUID()}`,
    };

    const result = resolveApprovalDecision("waiting_review", "approve", systemContext);
    assert.equal(result.status, "approved");
    assert.equal(result.approvedById, undefined, "System actor must not set approvedById");
  });
});
