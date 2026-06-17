import { test } from "node:test";
import assert from "node:assert";
import { DatasetDefinitionSchema } from "../../src/platform/datasets/contracts/dataset-definition";

const VALID_DATASET = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  workspaceId: "550e8400-e29b-41d4-a716-446655440001",
  key: "customer-orders",
  name: "Customer Orders",
  description: "Historical list of customer orders",
  version: 1,
  status: "published",
  kind: "transactional",
  recordSchema: {
    fields: [
      {
        key: "order_id",
        label: "Order ID",
        type: "string",
        required: true,
        nullable: false,
      },
      {
        key: "amount",
        label: "Amount",
        type: "number",
        required: true,
        nullable: false,
      },
    ],
  },
  refreshMode: "scheduled",
  tags: ["sales", "historical"],
  createdAt: "2023-10-27T10:00:00Z",
  updatedAt: "2023-10-27T10:00:00Z",
};

test("DatasetDefinitionSchema - should accept valid minimum dataset", () => {
  const minDataset = {
    ...VALID_DATASET,
    description: undefined,
    tags: undefined,
  };
  const result = DatasetDefinitionSchema.safeParse(minDataset);
  assert.strictEqual(result.success, true);
});

test("DatasetDefinitionSchema - should accept valid complete dataset", () => {
  const result = DatasetDefinitionSchema.safeParse(VALID_DATASET);
  assert.strictEqual(result.success, true);
});

test("DatasetDefinitionSchema - should reject invalid keys", () => {
  const invalidKeys = ["-invalid", "Invalid", "inv_alid", "in", "a".repeat(101)];
  invalidKeys.forEach((key) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, key });
    assert.strictEqual(result.success, false, `Should reject key: ${key}`);
  });
});

test("DatasetDefinitionSchema - should reject version zero or negative", () => {
  [0, -1].forEach((version) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, version });
    assert.strictEqual(result.success, false, `Should reject version: ${version}`);
  });
});

test("DatasetDefinitionSchema - should reject invalid status", () => {
  const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, status: "active" });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should reject speculative kind values", () => {
  ["analytical", "derived", "streaming"].forEach((kind) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, kind });
    assert.strictEqual(result.success, false, `Should reject kind: ${kind}`);
  });
});

test("DatasetDefinitionSchema - should reject speculative refresh mode values", () => {
  ["on_demand", "event_driven", "cron"].forEach((refreshMode) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, refreshMode });
    assert.strictEqual(result.success, false, `Should reject refreshMode: ${refreshMode}`);
  });
});

test("DatasetDefinitionSchema - should reject empty fields", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    recordSchema: { fields: [] },
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should reject duplicate field keys", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    recordSchema: {
      fields: [
        { key: "dup", type: "string", required: true, nullable: false },
        { key: "dup", type: "number", required: true, nullable: false },
      ],
    },
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should reject invalid field types", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    recordSchema: {
      fields: [{ key: "f1", type: "integer", required: true, nullable: false }],
    },
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should reject duplicate tags", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    tags: ["tag1", "tag1"],
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should reject unknown fields", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    unknownField: "should-fail",
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should reject invalid timestamps", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    createdAt: "2023-13-45T25:00:00Z",
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - should freeze output (shallowly)", () => {
  const result = DatasetDefinitionSchema.safeParse(VALID_DATASET);
  if (result.success) {
    assert.throws(() => {
      (result.data as any).name = "New Name";
    });
  } else {
    assert.fail("Schema should have parsed successfully");
  }
});

test("DatasetDefinitionSchema - should not mutate input", () => {
  const input = JSON.parse(JSON.stringify(VALID_DATASET));
  DatasetDefinitionSchema.parse(input);
  assert.deepStrictEqual(input, VALID_DATASET);
});

test("DatasetDefinitionSchema - metadata safety - should reject functions", () => {
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    metadata: {
      fn: () => console.log("evil"),
    },
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - metadata safety - should reject symbols", () => {
  const sym = Symbol("evil");
  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    metadata: { [sym]: "hostile" },
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - metadata safety - should reject mutual cycles", () => {
  const a: any = { name: "A" };
  const b: any = { name: "B" };
  a.ref = b;
  b.ref = a;

  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    metadata: { a },
  });
  assert.strictEqual(result.success, false);
});

test("DatasetDefinitionSchema - metadata safety - should accept shared acyclic references (DAGs)", () => {
  const shared = { name: "shared" };
  const dag = {
    first: shared,
    second: shared,
  };

  const result = DatasetDefinitionSchema.safeParse({
    ...VALID_DATASET,
    metadata: dag,
  });
  assert.strictEqual(result.success, true);
});

test("DatasetDefinitionSchema - sourceReference safety - should accept logical IDs", () => {
  const validSources = ["sql-orders-v1", "legacy_crm/clients", "s3.bucket.logs"];
  validSources.forEach((sourceReference) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, sourceReference });
    assert.strictEqual(result.success, true, `Should accept sourceReference: ${sourceReference}`);
  });
});

test("DatasetDefinitionSchema - sourceReference safety - should reject URLs and connection strings", () => {
  const invalidSources = [
    "https://api.example.com",
    "postgres://user:pass@localhost:5432/db",
    "mysql://root@localhost/db",
    "SELECT * FROM users",
  ];
  invalidSources.forEach((sourceReference) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, sourceReference });
    assert.strictEqual(result.success, false, `Should reject sourceReference: ${sourceReference}`);
  });
});

test("DatasetDefinitionSchema - sourceReference safety - should reject traversals and empty segments", () => {
  const invalidSources = [
    "source/../../secret",
    "source//table",
    "source/./table",
    "/source/table",
    "source/table/",
    "source..table",
    "source.table.",
    ".source.table"
  ];
  invalidSources.forEach((sourceReference) => {
    const result = DatasetDefinitionSchema.safeParse({ ...VALID_DATASET, sourceReference });
    assert.strictEqual(result.success, false, `Should reject sourceReference: ${sourceReference}`);
  });
});
