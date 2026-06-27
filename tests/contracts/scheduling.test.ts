import { test } from "node:test";
import assert from "node:assert";
import {
  scheduleSchema,
  allocationSchema,
  createShiftValidator,
  schedulingPolicySchema
} from "../../src/modules/schedules/contracts";

const VALID_UUID = "d290f1ee-6c54-4b01-90e6-d701748f0851";
const WORKSPACE_ID = "e290f1ee-6c54-4b01-90e6-d701748f0852";

test("Scheduling Contracts - Universal Schedule", async (t) => {
  await t.test("should validate a universal schedule", () => {
    const validSchedule = {
      id: VALID_UUID,
      workspaceId: WORKSPACE_ID,
      title: "Universal Shift",
      type: "any-type",
      status: "planned",
      startsAt: new Date("2024-01-01T08:00:00Z"),
      endsAt: new Date("2024-01-01T17:00:00Z"),
      resourceId: VALID_UUID,
      resourceType: "technician",
      metadata: {}
    };

    const result = scheduleSchema.safeParse(validSchedule);
    assert.strictEqual(result.success, true);
  });
});

test("Scheduling Contracts - Invalid Generic Intervals", async (t) => {
  const { availabilitySchema, coverageSchema } = await import("../../src/modules/schedules/contracts");

  await t.test("availability should fail if endsAt is before startsAt", () => {
    const data = {
      id: VALID_UUID,
      workspaceId: WORKSPACE_ID,
      resourceId: VALID_UUID,
      type: "available",
      startsAt: new Date("2024-01-01T12:00:00Z"),
      endsAt: new Date("2024-01-01T10:00:00Z"),
    };
    const result = availabilitySchema.safeParse(data);
    assert.strictEqual(result.success, false);
  });

  await t.test("coverage should validate correctly", () => {
    const data = {
      workspaceId: WORKSPACE_ID,
      periodStart: new Date("2024-01-01T08:00:00Z"),
      periodEnd: new Date("2024-01-01T17:00:00Z"),
      requiredCount: 5,
      actualCount: 3,
      status: "under"
    };
    const result = coverageSchema.safeParse(data);
    assert.strictEqual(result.success, true);
  });
});

test("Scheduling Contracts - Interval Validation", async (t) => {
  const policy = schedulingPolicySchema.parse({ minRestBetweenShiftsHours: 11 });
  const { createRestPeriodValidator } = await import("../../src/modules/schedules/contracts");
  const validator = createRestPeriodValidator(policy);

  await t.test("should fail if rest period is insufficient", () => {
    const data = {
      previousShiftEnd: new Date("2024-01-01T17:00:00Z"),
      nextShiftStart: new Date("2024-01-02T02:00:00Z"), // 9 hours later
    };
    const result = validator.safeParse(data);
    assert.strictEqual(result.success, false);
  });

  await t.test("should pass if rest period is sufficient", () => {
    const data = {
      previousShiftEnd: new Date("2024-01-01T17:00:00Z"),
      nextShiftStart: new Date("2024-01-02T08:00:00Z"), // 15 hours later
    };
    const result = validator.safeParse(data);
    assert.strictEqual(result.success, true);
  });
});

test("Scheduling Contracts - Generic Allocation", async (t) => {
  await t.test("should validate allocation to generic subject", () => {
    const validAllocation = {
      id: VALID_UUID,
      workspaceId: WORKSPACE_ID,
      scheduleId: VALID_UUID,
      resourceId: VALID_UUID,
      subjectType: "external_task",
      subjectId: VALID_UUID,
      status: "planned"
    };

    const result = allocationSchema.safeParse(validAllocation);
    assert.strictEqual(result.success, true);
  });
});

test("Scheduling Contracts - Policy Validation", async (t) => {
  const policy = schedulingPolicySchema.parse({ maxShiftDurationHours: 8 });
  const validator = createShiftValidator(policy);

  await t.test("should fail if shift exceeds custom policy duration", () => {
    const longShift = {
      startsAt: new Date("2024-01-01T08:00:00Z"),
      endsAt: new Date("2024-01-01T18:00:00Z"), // 10 hours
    };

    const result = validator.safeParse(longShift);
    assert.strictEqual(result.success, false);
  });

  await t.test("should pass if within custom policy duration", () => {
    const normalShift = {
      startsAt: new Date("2024-01-01T08:00:00Z"),
      endsAt: new Date("2024-01-01T14:00:00Z"), // 6 hours
    };

    const result = validator.safeParse(normalShift);
    assert.strictEqual(result.success, true);
  });
});
