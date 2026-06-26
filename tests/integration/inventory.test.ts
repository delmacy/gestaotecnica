import { test } from "node:test";
import assert from "node:assert";
import { getDb } from "../../src/db";
import { inventoryItems, inventoryMovements } from "../../src/db/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";

// This test assumes a DATABASE_URL is set and reachable in the environment,
// similar to other integration tests in the repo.
// Based on memory, we need DATABASE_URL="postgres://dummy" to prevent crash on import.

test("Inventory Integration - Multi-tenancy Isolation", { skip: !process.env.DATABASE_URL }, async (t) => {
  const db = getDb();
  const workspaceA = randomUUID();
  const workspaceB = randomUUID();

  await t.test("should separate items by workspace", async () => {
    const sku = `TEST-SKU-${Date.now()}`;

    // Insert for Workspace A
    await db.insert(inventoryItems).values({
      workspaceId: workspaceA,
      sku,
      name: "Item Workspace A",
      quantityOnHand: 10,
    });

    // Insert for Workspace B
    await db.insert(inventoryItems).values({
      workspaceId: workspaceB,
      sku,
      name: "Item Workspace B",
      quantityOnHand: 20,
    });

    const itemsA = await db.select().from(inventoryItems).where(eq(inventoryItems.workspaceId, workspaceA));
    const itemsB = await db.select().from(inventoryItems).where(eq(inventoryItems.workspaceId, workspaceB));

    assert.strictEqual(itemsA.length, 1);
    assert.strictEqual(itemsA[0].name, "Item Workspace A");
    assert.strictEqual(itemsB.length, 1);
    assert.strictEqual(itemsB[0].name, "Item Workspace B");
  });
});
