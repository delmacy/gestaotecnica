import { test } from "node:test";
import assert from "node:assert";
import {
  ProcessDefinitionSchema,
  ProcessVersionSchema,
  ProcessDefinitionKeySchema
} from "@/platform/workflows/contracts";

const validDefinitionBase = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  workspaceId: "123e4567-e89b-12d3-a456-426614174001",
  key: "my-process",
  name: "My Process",
  status: "draft",
  createdAt: "2023-10-27T10:00:00Z",
  updatedAt: "2023-10-27T10:00:00Z",
  createdById: "user-789",
};

const validVersionBase = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  workspaceId: "123e4567-e89b-12d3-a456-426614174001",
  processDefinitionId: "123e4567-e89b-12d3-a456-426614174000",
  version: 1,
  status: "draft",
  createdAt: "2023-10-27T10:00:00Z",
  updatedAt: "2023-10-27T10:00:00Z",
  createdById: "user-789",
  definition: {
    schemaVersion: "1.0.0",
    nodes: [],
    edges: [],
  },
};

test("ProcessDefinition - minimum valid", () => {
  const result = ProcessDefinitionSchema.safeParse(validDefinitionBase);
  assert.strictEqual(result.success, true);
});

test("ProcessDefinition - complete valid", () => {
  const complete = {
    ...validDefinitionBase,
    description: "A description",
    publishedVersionId: "123e4567-e89b-12d3-a456-426614174002",
    blueprintKey: "blueprint-1",
    blueprintVersion: 1,
    metadata: { foo: "bar" },
  };
  const result = ProcessDefinitionSchema.safeParse(complete);
  assert.strictEqual(result.success, true);
});

test("ProcessDefinition - required field missing", () => {
  const invalid = { ...validDefinitionBase };
  // @ts-ignore
  delete invalid.name;
  const result = ProcessDefinitionSchema.safeParse(invalid);
  assert.strictEqual(result.success, false);
});

test("ProcessDefinition - unknown field rejected", () => {
  const invalid = { ...validDefinitionBase, unknownField: "bad" };
  const result = ProcessDefinitionSchema.safeParse(invalid);
  assert.strictEqual(result.success, false);
});

test("ProcessDefinition - key validation", () => {
  const validKeys = ["abc", "process-1", "my-awesome-process", "p123"];
  validKeys.forEach(key => {
    assert.strictEqual(ProcessDefinitionKeySchema.safeParse(key).success, true, `Key ${key} should be valid`);
  });

  const invalidKeys = [
    "ab",          // too short
    "A-process",   // uppercase
    "process ",    // space
    "process_1",   // underscore
    "1-process",   // starts with number
    "process-",    // trailing hyphen
    "proc--ess",   // consecutive hyphens
  ];
  invalidKeys.forEach(key => {
    assert.strictEqual(ProcessDefinitionKeySchema.safeParse(key).success, false, `Key ${key} should be invalid`);
  });
});

test("ProcessDefinition - name constraints", () => {
  assert.strictEqual(ProcessDefinitionSchema.safeParse({ ...validDefinitionBase, name: "" }).success, false, "Empty name should be rejected");
  assert.strictEqual(ProcessDefinitionSchema.safeParse({ ...validDefinitionBase, name: "a".repeat(201) }).success, false, "Name > 200 should be rejected");
});

test("ProcessDefinition - description constraints", () => {
  assert.strictEqual(ProcessDefinitionSchema.safeParse({ ...validDefinitionBase, description: "a".repeat(2001) }).success, false, "Description > 2000 should be rejected");
});

test("ProcessDefinition - status invalid", () => {
  assert.strictEqual(ProcessDefinitionSchema.safeParse({ ...validDefinitionBase, status: "active" }).success, false);
});

test("ProcessDefinition - isActive rejected", () => {
  const result = ProcessDefinitionSchema.safeParse({ ...validDefinitionBase, isActive: true });
  assert.strictEqual(result.success, false);
});

test("ProcessVersion - minimum draft valid", () => {
  const result = ProcessVersionSchema.safeParse(validVersionBase);
  assert.strictEqual(result.success, true);
});

test("ProcessVersion - published valid", () => {
  const published = {
    ...validVersionBase,
    status: "published",
    publishedAt: "2023-10-27T11:00:00Z",
    publishedById: "123e4567-e89b-12d3-a456-426614174003",
  };
  const result = ProcessVersionSchema.safeParse(published);
  assert.strictEqual(result.success, true);
});

test("ProcessVersion - published missing publishedAt rejected", () => {
  const published = {
    ...validVersionBase,
    status: "published",
    publishedById: "123e4567-e89b-12d3-a456-426614174003",
  };
  const result = ProcessVersionSchema.safeParse(published);
  assert.strictEqual(result.success, false);
});

test("ProcessVersion - published missing publishedById rejected", () => {
  const published = {
    ...validVersionBase,
    status: "published",
    publishedAt: "2023-10-27T11:00:00Z",
  };
  const result = ProcessVersionSchema.safeParse(published);
  assert.strictEqual(result.success, false);
});

test("ProcessVersion - version validation", () => {
  assert.strictEqual(ProcessVersionSchema.safeParse({ ...validVersionBase, version: 0 }).success, false);
  assert.strictEqual(ProcessVersionSchema.safeParse({ ...validVersionBase, version: 1.5 }).success, false);
});

test("ProcessVersion - definition validation", () => {
  // minimum definition
  assert.strictEqual(ProcessVersionSchema.safeParse(validVersionBase).success, true);

  // missing schemaVersion
  const noSchema = {
    ...validVersionBase,
    definition: { nodes: [], edges: [] }
  };
  // @ts-ignore
  delete noSchema.definition.schemaVersion;
  assert.strictEqual(ProcessVersionSchema.safeParse(noSchema).success, false);

  // unknown field in definition
  const unknownField = {
    ...validVersionBase,
    definition: { schemaVersion: "1", nodes: [], edges: [], extra: true }
  };
  assert.strictEqual(ProcessVersionSchema.safeParse(unknownField).success, false);

  // nodes and edges accept valid structures
  const withNodes = {
    ...validVersionBase,
    definition: {
      schemaVersion: "1",
      nodes: [{ id: "1", key: "node-1", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} }],
      edges: []
    }
  };
  assert.strictEqual(ProcessVersionSchema.safeParse(withNodes).success, true);
});

test("ProcessVersion - metadata valid", () => {
  const withMetadata = {
    ...validVersionBase,
    metadata: { key: "value" }
  };
  assert.strictEqual(ProcessVersionSchema.safeParse(withMetadata).success, true);
});

test("ProcessVersion - timestamps invalid", () => {
  assert.strictEqual(ProcessVersionSchema.safeParse({ ...validVersionBase, createdAt: "2023-10-27" }).success, false);
});

test("ProcessVersion - rejects duplicate node IDs", () => {
  const duplicateNode = {
    ...validVersionBase,
    definition: {
      schemaVersion: "1",
      nodes: [
        { id: "1", key: "node-1", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
        { id: "1", key: "node-2", type: "end", name: "End", position: { x: 10, y: 10 }, config: {} }
      ],
      edges: []
    }
  };
  const result = ProcessVersionSchema.safeParse(duplicateNode);
  assert.strictEqual(result.success, false);
});

test("ProcessVersion - rejects duplicate edge IDs", () => {
  const duplicateEdge = {
    ...validVersionBase,
    definition: {
      schemaVersion: "1",
      nodes: [
        { id: "1", key: "node-1", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} },
        { id: "2", key: "node-2", type: "end", name: "End", position: { x: 10, y: 10 }, config: {} }
      ],
      edges: [
        { id: "e1", sourceNodeId: "1", targetNodeId: "2", type: "default", priority: 0 },
        { id: "e1", sourceNodeId: "1", targetNodeId: "2", type: "default", priority: 1 }
      ]
    }
  };
  const result = ProcessVersionSchema.safeParse(duplicateEdge);
  assert.strictEqual(result.success, false);
});

test("ProcessVersion - rejects missing source node in edge", () => {
  const missingSource = {
    ...validVersionBase,
    definition: {
      schemaVersion: "1",
      nodes: [
        { id: "2", key: "node-2", type: "end", name: "End", position: { x: 10, y: 10 }, config: {} }
      ],
      edges: [
        { id: "e1", sourceNodeId: "1", targetNodeId: "2", type: "default", priority: 0 }
      ]
    }
  };
  const result = ProcessVersionSchema.safeParse(missingSource);
  assert.strictEqual(result.success, false);
});

test("ProcessVersion - rejects missing target node in edge", () => {
  const missingTarget = {
    ...validVersionBase,
    definition: {
      schemaVersion: "1",
      nodes: [
        { id: "1", key: "node-1", type: "start", name: "Start", position: { x: 0, y: 0 }, config: {} }
      ],
      edges: [
        { id: "e1", sourceNodeId: "1", targetNodeId: "2", type: "default", priority: 0 }
      ]
    }
  };
  const result = ProcessVersionSchema.safeParse(missingTarget);
  assert.strictEqual(result.success, false);
});
