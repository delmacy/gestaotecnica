import { test } from "node:test";
import assert from "node:assert";
import { getCapabilityCatalog, upsertCapabilities } from "../../../../src/platform/registry/infra/registry.queries";
import { seedCapabilities } from "../../../../src/scripts/seed-capabilities";
import { mapDbCapabilityToCapabilityItem } from "../../../../src/platform/registry/capability-adapter";
import { closeDatabaseConnections } from "../../../../src/db";
import { capabilities } from "../../../../src/db/platform/schema/registry";
import { getPlatformDb } from "../../../../src/db";
import { inArray } from "drizzle-orm";

test("capability seeding and catalog tests", async (t) => {
  // Use isolated test database mode
  const db = getPlatformDb();

  await t.test("seedCapabilities() inserts rows correctly", async () => {
    // Ensure clean state for test items
    await db.delete(capabilities).where(inArray(capabilities.key, [
        "capability_intake",
        "capability_approval",
        "capability_organization",
        "capability_people"
    ]));

    await seedCapabilities();

    const result = await db.select().from(capabilities).where(inArray(capabilities.key, [
        "capability_intake",
        "capability_approval",
        "capability_organization",
        "capability_people"
    ]));

    assert.strictEqual(result.length, 4, "Should insert all 4 minimal capabilities");
  });

  await t.test("getCapabilityCatalog() returns the seeded data", async () => {
    const catalog = await getCapabilityCatalog();

    assert.ok(catalog.length >= 4, "Catalog should have at least the 4 seeded capabilities");
    const keys = catalog.map((c: { key: string }) => c.key);
    assert.ok(keys.includes("capability_intake"));
    assert.ok(keys.includes("capability_approval"));
    assert.ok(keys.includes("capability_organization"));
    assert.ok(keys.includes("capability_people"));
  });

  await t.test("capability adapter correctly maps DB rows to expected shape", async () => {
    const mockDbRow = {
        id: "123",
        key: "test_key",
        name: "Test Name",
        description: "Test Description",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mapped = mapDbCapabilityToCapabilityItem(mockDbRow);

    assert.strictEqual(mapped.id, "123");
    assert.strictEqual(mapped.slug, "test_key");
    assert.strictEqual(mapped.name, "Test Name");
    assert.strictEqual(mapped.description, "Test Description");
    assert.strictEqual(mapped.status, "documented");
    assert.strictEqual(mapped.synthetic_notes, "Real data from DB");
  });

  await t.test("teardown connections", async () => {
    await closeDatabaseConnections();
  });
});
