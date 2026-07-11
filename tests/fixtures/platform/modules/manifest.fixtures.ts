export const VALID_MANIFEST_FIXTURE = {
  key: "test-module",
  name: "Test Module",
};

export const VALID_FULL_MANIFEST_FIXTURE = {
  key: "test-module",
  name: "Test Module",
  description: "A test module",
  actions: ["action1", "action2"],
  events: ["event1", "event2"],
  views: ["view1", "view2"],
  dependencies: ["dep1", "dep2"],
  lifecycleStatus: "active"
};

export const INVALID_MANIFEST_FIXTURES: unknown[] = [
  {
    key: "test-module",
    name: "Test Module",
    actions: ["action1", "action1"]
  },
  {
    key: "test-module",
    name: "Test Module",
    events: ["event1", "event1"]
  },
  {
    key: "test-module",
    name: "Test Module",
    views: ["view1", "view1"]
  },
  {
    key: "test-module",
    name: "Test Module",
    dependencies: ["dep1", "dep1"]
  }
];

export const VALID_STRICT_MANIFEST_FIXTURE = {
  id: "module-id-123",
  key: "test-module",
  name: "Test Module",
  version: "1.0.0",
  capabilities: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"],
  lifecycleMetadata: { author: "test" }
};

export const INVALID_STRICT_MANIFEST_FIXTURES: unknown[] = [
  { ...VALID_STRICT_MANIFEST_FIXTURE, id: undefined },
  { ...VALID_STRICT_MANIFEST_FIXTURE, version: undefined },
  { ...VALID_STRICT_MANIFEST_FIXTURE, capabilities: undefined },
  { ...VALID_STRICT_MANIFEST_FIXTURE, lifecycleMetadata: undefined },
  { ...VALID_STRICT_MANIFEST_FIXTURE, version: "v1.0" },
  { ...VALID_STRICT_MANIFEST_FIXTURE, capabilities: [""] },
  { ...VALID_STRICT_MANIFEST_FIXTURE, capabilities: ["not-a-uuid"] },
];
