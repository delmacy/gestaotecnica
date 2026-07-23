import { test } from "node:test";
import assert from "node:assert";
import { getRuntimeDb } from "../../src/db";
import { workItems } from "../../src/db/legacy/schema";
import { eq } from "drizzle-orm";

test("RD-02-007: Seeding creates real operational data in WorkItem", async (t) => {
  const db = getRuntimeDb();

  const results = await db
    .select()
    .from(workItems)
    .where(eq(workItems.title, "Workflow Seed Demanda"));

  assert.strictEqual(results.length > 0, true, "Seeded work item should exist");

  const seededItem = results[0];

  // Need to correctly type payload because of unknown parsing from DB in test context
  const payload = seededItem.payload as Record<string, unknown> | null;
  assert.strictEqual(payload !== null, true, "Payload should not be null");

  if (payload) {
    assert.strictEqual(payload.real_data, true, "The workItem should be marked with real_data: true");
    assert.strictEqual(payload.source, "seed_workflow_seed", "The workItem source should match the seed");
  }
});
