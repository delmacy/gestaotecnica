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

test("getReports handles no options", async () => {
  let whereCalled = false;
  let limitValue = 0;
  let offsetValue = -1;

  const localMockDb = {
    ...mockDb,
    select: () => localMockDb,
    from: () => localMockDb,
    where: (cond: unknown) => {
      whereCalled = !!cond;
      return localMockDb;
    },
    orderBy: () => localMockDb,
    limit: (l: number) => {
      limitValue = l;
      return localMockDb;
    },
    offset: (o: number) => {
      offsetValue = o;
      return localMockDb;
    },
  } as unknown as typeof mockDb;

  const { getReports: testGetReports } = proxyquire("../../src/modules/reports/queries", {
    "@/db": { getDb: () => localMockDb },
    "drizzle-orm": drizzleMock,
  });

  await testGetReports();

  assert.strictEqual(whereCalled, false);
  assert.strictEqual(limitValue, 20);
  assert.strictEqual(offsetValue, 0);
});

test("getReports applies filters", async () => {
  let whereCondition: { type: string; args: unknown[] } | null = null;

  const localMockDb = {
    ...mockDb,
    select: () => localMockDb,
    from: () => localMockDb,
    where: (cond: { type: string; args: unknown[] }) => {
      whereCondition = cond;
      return localMockDb;
    },
    orderBy: () => localMockDb,
    limit: () => localMockDb,
    offset: () => localMockDb,
  } as unknown as typeof mockDb;

  const { getReports: testGetReports } = proxyquire("../../src/modules/reports/queries", {
    "@/db": { getDb: () => localMockDb },
    "drizzle-orm": drizzleMock,
  });

  const startDate = new Date("2023-01-01");
  await testGetReports({ type: "test-type", startDate });

  assert.ok(whereCondition, "whereCondition should be defined");
  assert.strictEqual(whereCondition.type, "and");
  assert.strictEqual(whereCondition.args.length, 2);
  const arg0 = whereCondition.args[0] as { type: string };
  const arg1 = whereCondition.args[1] as { type: string };
  assert.strictEqual(arg0.type, "eq");
  assert.strictEqual(arg1.type, "gte");
});
