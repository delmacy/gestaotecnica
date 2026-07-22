import { test } from "node:test";
import assert from "node:assert";
import { getPlatformDb, getRuntimeDb, closeDatabaseConnections } from "../../src/db";
import { eq } from "drizzle-orm";
import { workspaces } from "../../src/db/runtime/schema/workspace";
import { forms } from "../../src/db/runtime/schema/workflow";
import { seedWorkflowSeed } from "../../src/scripts/workflow-seed/seed";
import { cleanWorkflowSeed } from "../../src/scripts/workflow-seed/clean";
import { WORKFLOW_SEED } from "../../src/scripts/workflow-seed/constants";

test("Workflow Seed idempotent tests", async (t) => {
  const dbPlatform = getPlatformDb();
  const dbRuntime = getRuntimeDb();

  await cleanWorkflowSeed(dbPlatform, dbRuntime);

  await t.test("should seed data correctly initially", async () => {
    await seedWorkflowSeed(dbPlatform, dbRuntime);

    const seededWorkspace = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORKFLOW_SEED.workspace.key));
    assert.strictEqual(seededWorkspace.length, 1);

    const seededForms = await dbRuntime.select().from(forms).where(eq(forms.key, WORKFLOW_SEED.forms[0].key));
    assert.strictEqual(seededForms.length, 1);
  });

  await t.test("should be idempotent when run a second time", async () => {
    // Running a second time should not throw
    await seedWorkflowSeed(dbPlatform, dbRuntime);

    const seededWorkspace = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORKFLOW_SEED.workspace.key));
    assert.strictEqual(seededWorkspace.length, 1);

    const seededForms = await dbRuntime.select().from(forms).where(eq(forms.key, WORKFLOW_SEED.forms[0].key));
    assert.strictEqual(seededForms.length, 1);
  });

  await t.test("should cleanup data correctly", async () => {
    await cleanWorkflowSeed(dbPlatform, dbRuntime);

    const seededWorkspace = await dbRuntime.select().from(workspaces).where(eq(workspaces.key, WORKFLOW_SEED.workspace.key));
    assert.strictEqual(seededWorkspace.length, 0);

    const seededForms = await dbRuntime.select().from(forms).where(eq(forms.key, WORKFLOW_SEED.forms[0].key));
    assert.strictEqual(seededForms.length, 0);
  });

  await closeDatabaseConnections();
});
