import { test } from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";

const mockDb = {
  select: () => mockDb,
  from: () => mockDb,
  where: () => mockDb,
  groupBy: () => mockDb,
  orderBy: () => mockDb,
  limit: () => mockDb,
  offset: () => mockDb,
  leftJoin: () => mockDb,
};

const drizzleMock = {
  and: (...args: unknown[]) => ({ type: "and", args }),
  count: () => ({ type: "count" }),
  desc: (col: unknown) => ({ type: "desc", col }),
  eq: (col: unknown, val: unknown) => ({ type: "eq", col, val }),
  gte: (col: unknown, val: unknown) => ({ type: "gte", col, val }),
  lte: (col: unknown, val: unknown) => ({ type: "lte", col, val }),
  sql: (strings: unknown, ...vals: unknown[]) => ({ type: "sql", strings, vals }),
};

test("getReports returns empty list due to blocked legacy data", async () => {
  const { getReports: testGetReports } = proxyquire("../../src/modules/reports/queries", {
    "@/db": { getDb: () => mockDb },
    "drizzle-orm": drizzleMock,
  });

  const reports = await testGetReports();
  assert.strictEqual(reports.length, 0, "Should return empty list for unisolated legacy data");
});
