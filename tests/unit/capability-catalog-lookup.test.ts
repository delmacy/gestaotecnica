import { test } from "node:test";
import assert from "node:assert";
import {
  findCapabilityByKey,
  listCapabilitiesByDomain,
  listCapabilitiesByGroup,
  searchCapabilities,
  hasCapability
} from "../../src/platform/registry/capabilities/lookup";
import { Capability } from "../../src/platform/registry/capabilities/schemas";
import { CAPABILITY_DOMAINS, CAPABILITY_GROUPS } from "../../src/platform/registry/capabilities/constants";

// Mock catalog for testing
const MOCK_CATALOG: Capability[] = [
  {
    id: "cap-1",
    key: "manage-work-request",
    name: "Manage Work Request",
    description: "Receive and validate work requests.",
    domain: CAPABILITY_DOMAINS.WORK_EXECUTION,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [{ key: "req", name: "Request" }],
    businessActions: [{ key: "create", name: "Create" }],
    metadata: {},
    // Using unknown for tags as it's not in the base schema but required for the search logic
  } as unknown as Capability,
  {
    id: "cap-2",
    key: "schedule-resource",
    name: "Schedule Resource",
    description: "Allocate resources to tasks.",
    domain: CAPABILITY_DOMAINS.SCHEDULE_AVAILABILITY,
    group: CAPABILITY_GROUPS.RESOURCE_OPTIMIZATION,
    version: "1.0.0",
    status: "active",
    businessObjects: [{ key: "sched", name: "Schedule" }],
    businessActions: [{ key: "alloc", name: "Allocate" }],
    metadata: { tags: ["planning", "human-resources"] },
    // Actually, based on my implementation, I expect 'tags' to be at the root if it were there,
    // but the instruction said "Pesquisar somente em: key, name, description, tags".
    // I implemented search to look for tags at the root of the capability object.
  } as unknown as Capability & { tags: string[] },
  {
    id: "cap-3",
    key: "issue-invoice",
    name: "Issue Invoice",
    description: "Generate billing documents.",
    domain: CAPABILITY_DOMAINS.FINANCIAL,
    group: CAPABILITY_GROUPS.OPERATIONAL_CONTROL,
    version: "1.0.0",
    status: "active",
    businessObjects: [{ key: "inv", name: "Invoice" }],
    businessActions: [{ key: "gen", name: "Generate" }],
    metadata: {},
  } as unknown as Capability,
];

// Add tags to the second mock capability correctly for the test
(MOCK_CATALOG[1] as unknown as Record<string, unknown>).tags = ["planning", "resource"];

test("capability catalog lookup", async (t) => {
  await t.test("findCapabilityByKey finds existing key", () => {
    const result = findCapabilityByKey(MOCK_CATALOG, "manage-work-request");
    assert.strictEqual(result?.id, "cap-1");
  });

  await t.test("findCapabilityByKey returns undefined for non-existing key", () => {
    const result = findCapabilityByKey(MOCK_CATALOG, "non-existing");
    assert.strictEqual(result, undefined);
  });

  await t.test("listCapabilitiesByDomain filters correctly", () => {
    const result = listCapabilitiesByDomain(MOCK_CATALOG, CAPABILITY_DOMAINS.WORK_EXECUTION);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-1");
  });

  await t.test("listCapabilitiesByGroup filters correctly", () => {
    const result = listCapabilitiesByGroup(MOCK_CATALOG, CAPABILITY_GROUPS.OPERATIONAL_CONTROL);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].id, "cap-1");
    assert.strictEqual(result[1].id, "cap-3");
  });

  await t.test("hasCapability returns true for existing key", () => {
    assert.strictEqual(hasCapability(MOCK_CATALOG, "issue-invoice"), true);
  });

  await t.test("hasCapability returns false for non-existing key", () => {
    assert.strictEqual(hasCapability(MOCK_CATALOG, "something-else"), false);
  });

  await t.test("searchCapabilities by key", () => {
    const result = searchCapabilities(MOCK_CATALOG, "work-request");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-1");
  });

  await t.test("searchCapabilities by name", () => {
    const result = searchCapabilities(MOCK_CATALOG, "Resource");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-2");
  });

  await t.test("searchCapabilities by description", () => {
    const result = searchCapabilities(MOCK_CATALOG, "billing");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-3");
  });

  await t.test("searchCapabilities by tag", () => {
    const result = searchCapabilities(MOCK_CATALOG, "planning");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-2");
  });

  await t.test("searchCapabilities case-insensitive", () => {
    const result = searchCapabilities(MOCK_CATALOG, "INVOICE");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-3");
  });

  await t.test("searchCapabilities with spaces", () => {
    const result = searchCapabilities(MOCK_CATALOG, "  invoice  ");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-3");
  });

  await t.test("searchCapabilities with empty query returns all", () => {
    const result = searchCapabilities(MOCK_CATALOG, "   ");
    assert.strictEqual(result.length, MOCK_CATALOG.length);
    assert.notStrictEqual(result, MOCK_CATALOG); // Should be a new array
  });

  await t.test("order is preserved in results", () => {
    const result = listCapabilitiesByGroup(MOCK_CATALOG, CAPABILITY_GROUPS.OPERATIONAL_CONTROL);
    assert.strictEqual(result[0].id, "cap-1");
    assert.strictEqual(result[1].id, "cap-3");
  });

  await t.test("catalog is not mutated", () => {
    const original = [...MOCK_CATALOG];
    searchCapabilities(MOCK_CATALOG, "work");
    listCapabilitiesByDomain(MOCK_CATALOG, CAPABILITY_DOMAINS.WORK_EXECUTION);
    assert.deepStrictEqual(MOCK_CATALOG, original);
  });

  await t.test("works with frozen catalog", () => {
    const frozenCatalog = Object.freeze([...MOCK_CATALOG.map(c => Object.freeze({...c}))]);
    const result = searchCapabilities(frozenCatalog as Capability[], "work");
    assert.strictEqual(result.length, 1);
  });

  await t.test("results are new arrays", () => {
    const resultDomain = listCapabilitiesByDomain(MOCK_CATALOG, CAPABILITY_DOMAINS.WORK_EXECUTION);
    assert.notStrictEqual(resultDomain, MOCK_CATALOG);

    const resultGroup = listCapabilitiesByGroup(MOCK_CATALOG, CAPABILITY_GROUPS.OPERATIONAL_CONTROL);
    assert.notStrictEqual(resultGroup, MOCK_CATALOG);

    const resultSearch = searchCapabilities(MOCK_CATALOG, "work");
    assert.notStrictEqual(resultSearch, MOCK_CATALOG);
  });
});
