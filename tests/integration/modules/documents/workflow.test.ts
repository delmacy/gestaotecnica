import "dotenv/config";
import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { getRuntimeDb, closeDatabaseConnections } from "../../../../src/db";
import { eq } from "drizzle-orm";
import { documents } from "../../../../src/db/runtime/schema/documents";
import { generateDocumentKernelAction, transitionDocumentKernelAction } from "../../../../src/modules/documents/kernel-actions";
import { organizations, workspaces } from "../../../../src/db/runtime/schema/workspace";

let db: any;
let workspaceId: string;

before(async () => {
    db = getRuntimeDb();

    // Setup test data
    const [org] = await db.insert(organizations).values({
        key: "test-org-" + Date.now(),
        name: "Test Org"
    }).returning();

    const [ws] = await db.insert(workspaces).values({
        organizationId: org.id,
        key: "test-ws-" + Date.now(),
        name: "Test Workspace",
        adaptationKey: "gestaotecnica"
    }).returning();

    workspaceId = ws.id;
});

after(async () => {
    if (db && workspaceId) {
        await db.delete(documents).where(eq(documents.workspaceId, workspaceId));
        await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
    }
    await closeDatabaseConnections();
});

test("Full Document Workflow (New Schema)", async () => {
    const context = { workspaceId };

    // 1. Generate
    const genResult = await generateDocumentKernelAction.handler({
        title: "Integration Test Document",
        documentType: "technical_report",
        content: "Some initial content"
    }, context as any);

    assert.equal(genResult.success, true);
    const docId = genResult.data!.id;
    assert.ok(docId);

    // Verify in DB
    const [dbDoc] = await db.select().from(documents).where(eq(documents.id, docId));
    assert.equal(dbDoc.title, "Integration Test Document");
    assert.equal(dbDoc.status, "draft");

    // 2. Transition
    const transResult = await transitionDocumentKernelAction.handler({
        documentId: docId,
        status: "approved",
        note: "All good"
    }, context as any);

    assert.equal(transResult.success, true);
    assert.equal(transResult.data!.status, "approved");

    // Verify update in DB
    const [updatedDoc] = await db.select().from(documents).where(eq(documents.id, docId));
    assert.equal(updatedDoc.status, "approved");
});
