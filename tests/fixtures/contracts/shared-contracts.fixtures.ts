export const VALID_UUIDS = [
  "550e8400-e29b-41d4-a716-446655440000",
  "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
];

export const INVALID_UUIDS = [
  "",
  "not-a-uuid",
  "550e8400-e29b-41d4-a716-44665544000", // too short
  "550e8400-e29b-41d4-a716-4466554400001", // too long
];

export const VALID_ENTITY_IDS = [
  "id-123",
  "user_1",
  "550e8400-e29b-41d4-a716-446655440000",
];

export const INVALID_ENTITY_IDS = [
  "",
];

export const VALID_WORKSPACE_CONTEXTS = [
  { workspaceId: "550e8400-e29b-41d4-a716-446655440000" },
];

export const INVALID_WORKSPACE_CONTEXTS = [
  {},
  { workspaceId: "invalid-uuid" },
  { workspaceId: "" },
  { other: "field" },
];

export const VALID_ACTOR_REFERENCES = [
  { type: "human", id: "user-123" },
  { type: "system", id: "internal-cron" },
  { type: "worker", id: "jules-001" },
  { type: "integration", id: "n8n-hook" },
];

export const INVALID_ACTOR_REFERENCES = [
  { type: "alien", id: "user-123" },
  { type: "human", id: "" },
  { id: "user-123" },
  { type: "human" },
  {},
];

export const VALID_CORRELATION_CONTEXTS = [
  { correlationId: "corr-1" },
  { correlationId: "corr-2", causationId: "caus-1" },
  { correlationId: "corr-3", idempotencyKey: "idem-1" },
  { correlationId: "corr-4", causationId: "caus-2", idempotencyKey: "idem-2" },
];

export const INVALID_CORRELATION_CONTEXTS = [
  {},
  { causationId: "caus-1" },
  { correlationId: "" },
  { correlationId: 123 },
];

export const VALID_UNKNOWN_RECORDS = [
  {},
  { key: "value" },
  { num: 1, bool: true, obj: { a: 1 }, arr: [1, 2] },
];

export const INVALID_UNKNOWN_RECORDS = [
  "not-a-record",
  123,
  null,
  [],
];

export const VALID_SCHEMA_VERSIONS = [
  "1.0.0",
  "0.1.0",
  "2.5.12",
];

export const INVALID_SCHEMA_VERSIONS = [
  "1.0",
  "1.0.0.0",
  "v1.0.0",
  "1.a.0",
  "",
];

export const VALID_ISO_DATETIMES = [
  "2023-10-27T10:00:00Z",
  "2023-10-27T10:00:00.000Z",
];

export const INVALID_ISO_DATETIMES = [
  "2023-10-27",
  "not-a-date",
  "2023-13-27T10:00:00Z", // Invalid month
  "2023-10-32T10:00:00Z", // Invalid day
  "",
];
