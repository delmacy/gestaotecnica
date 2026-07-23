import test from "node:test";
import assert from "node:assert";
import {
  TenantCommercialContextSchema,
  CommercialCapabilitySchema,
  CapabilityStatusSchema
} from "@/platform/commercial/contracts/commercial-ia-map";

test("Commercial IA Map Contracts", async (t) => {
  await t.test("should validate a valid capability status", () => {
    assert.strictEqual(CapabilityStatusSchema.parse("active"), "active");
    assert.strictEqual(CapabilityStatusSchema.parse("blocked"), "blocked");
    assert.strictEqual(CapabilityStatusSchema.parse("coming_soon"), "coming_soon");
    assert.strictEqual(CapabilityStatusSchema.parse("pending_setup"), "pending_setup");
  });

  await t.test("should reject an invalid capability status", () => {
    assert.throws(() => CapabilityStatusSchema.parse("unknown"));
  });

  await t.test("should validate a well-formed CommercialCapability", () => {
    const validCapability = {
      id: "mod_inventory",
      name: "Inventory Management",
      description: "Track items, stock, and locations",
      category: "Core Operations",
      status: "active",
    };

    assert.doesNotThrow(() => CommercialCapabilitySchema.parse(validCapability));
    const result = CommercialCapabilitySchema.parse(validCapability);
    assert.strictEqual(result.id, "mod_inventory");
  });

  await t.test("should validate a complete TenantCommercialContext", () => {
    const validContext = {
      workspaceId: "ws-1234",
      activeCapabilities: [
        {
          id: "mod_workforce",
          name: "Workforce Configuration",
          description: "Manage workforce roles and permissions",
          category: "Core Operations",
          status: "active",
        }
      ],
      quotas: {
        "active_users": 50,
      },
      utilizationMetrics: {
        "active_users": 12,
      },
    };

    assert.doesNotThrow(() => TenantCommercialContextSchema.parse(validContext));
    const parsed = TenantCommercialContextSchema.parse(validContext);
    assert.strictEqual(parsed.workspaceId, "ws-1234");
    assert.strictEqual(parsed.activeCapabilities.length, 1);
    assert.strictEqual(parsed.quotas.active_users, 50);
  });
});
