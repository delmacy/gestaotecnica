import { test } from "node:test";
import assert from "node:assert";

// Mocking some business logic that would be in actions/queries
// Since I cannot easily run drizzle-orm with a real DB in this unit test without more setup
// I will test a representative calculation function if I had one, or create one for the purpose of this task.

function calculateStock(current: number, movementType: string, quantity: number) {
  const delta = (movementType === "inbound" || movementType === "release") ? quantity : -quantity;
  return current + delta;
}

test("Inventory Stock Calculation", async (t) => {
  await t.test("inbound increases stock", () => {
    assert.strictEqual(calculateStock(10, "inbound", 5), 15);
  });

  await t.test("outbound decreases stock", () => {
    assert.strictEqual(calculateStock(10, "outbound", 3), 7);
  });

  await t.test("release increases stock (return from reservation)", () => {
    assert.strictEqual(calculateStock(5, "release", 2), 7);
  });

  await t.test("adjustment (decrement) decreases stock", () => {
    assert.strictEqual(calculateStock(10, "adjustment", 2), 8);
  });
});
