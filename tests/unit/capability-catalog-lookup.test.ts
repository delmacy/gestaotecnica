import { test } from "node:test";
import assert from "node:assert";
import {
  findCapabilityByKey,
  listCapabilitiesByDomain,
  listCapabilitiesByGroup,
  searchCapabilities,
  hasCapability,
  listDependentCapabilities,
  listRelatedCapabilities
} from "../../src/platform/registry/capabilities/lookup";
import { Capability } from "../../src/platform/registry/capabilities/schemas";
import { CAPABILITY_DOMAINS, CAPABILITY_GROUPS } from "../../src/platform/registry/capabilities/constants";

// Mock catalog for testing with canonical metadata.tags
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
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: ["schedule-resource", "issue-invoice"],
    applicableSectors: [],
    metadata: {},
  },
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
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: ["manage-work-request"],
    relatedCapabilities: ["manage-work-request", "issue-invoice"],
    applicableSectors: [],
    metadata: {
      tags: ["planning", "resource", 123] // includes non-string to test safety
    },
  },
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
    businessEvents: [],
    businessRules: [],
    roles: [],
    inputs: [],
    outputs: [],
    dependencies: [],
    relatedCapabilities: ["manage-work-request"],
    applicableSectors: [],
    metadata: {},
  },
];

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

  await t.test("searchCapabilities by tag (metadata.tags)", () => {
    const result = searchCapabilities(MOCK_CATALOG, "planning");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-2");
  });

  await t.test("searchCapabilities ignores non-string tags and handles missing tags safely", () => {
    // Should match "resource" but ignore 123
    const resultResource = searchCapabilities(MOCK_CATALOG, "resource");
    assert.strictEqual(resultResource.length, 1);
    assert.strictEqual(resultResource[0].id, "cap-2");

    // Should not match 123 (as a string it won't be there because of the filter)
    const resultNum = searchCapabilities(MOCK_CATALOG, "123");
    assert.strictEqual(resultNum.length, 0);
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
    const original = JSON.stringify(MOCK_CATALOG);
    searchCapabilities(MOCK_CATALOG, "work");
    listCapabilitiesByDomain(MOCK_CATALOG, CAPABILITY_DOMAINS.WORK_EXECUTION);
    assert.strictEqual(JSON.stringify(MOCK_CATALOG), original);
  });

  await t.test("works with frozen catalog", () => {
    const frozenCatalog = Object.freeze([...MOCK_CATALOG.map(c => Object.freeze({...c, metadata: Object.freeze({...c.metadata})}))]);
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

  await t.test("listDependentCapabilities returns correct direct dependencies", () => {
    const result = listDependentCapabilities(MOCK_CATALOG, "manage-work-request");
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, "cap-2");
  });

  await t.test("listDependentCapabilities returns empty list for missing target key", () => {
    assert.strictEqual(listDependentCapabilities(MOCK_CATALOG, "").length, 0);
  });

  await t.test("listDependentCapabilities returns empty list for non-existing target key", () => {
    assert.strictEqual(listDependentCapabilities(MOCK_CATALOG, "non-existing").length, 0);
  });

  await t.test("listRelatedCapabilities returns capabilities related to target key (forward)", () => {
    // cap-1 (manage-work-request) has forward links to schedule-resource and issue-invoice
    // We expect both of those returned. Also cap-2 and cap-3 have reverse links to cap-1, but the filter should return unique.
    const result = listRelatedCapabilities(MOCK_CATALOG, "manage-work-request");
    assert.strictEqual(result.length, 2);
    const resultKeys = result.map(c => c.key);
    assert.ok(resultKeys.includes("schedule-resource"));
    assert.ok(resultKeys.includes("issue-invoice"));
  });

  await t.test("listRelatedCapabilities returns capabilities related to target key (reverse)", () => {
    // issue-invoice has forward link to manage-work-request
    // cap-1 (manage-work-request) has forward link to issue-invoice
    // cap-2 (schedule-resource) has forward link to issue-invoice
    const result = listRelatedCapabilities(MOCK_CATALOG, "issue-invoice");
    assert.strictEqual(result.length, 2);
    const resultKeys = result.map(c => c.key);
    assert.ok(resultKeys.includes("manage-work-request"));
    assert.ok(resultKeys.includes("schedule-resource"));
  });

  await t.test("listRelatedCapabilities ensures duplicates are not returned", () => {
    // schedule-resource has forward links to manage-work-request and issue-invoice
    // manage-work-request has forward link to schedule-resource
    // issue-invoice has no forward link to schedule-resource
    const result = listRelatedCapabilities(MOCK_CATALOG, "schedule-resource");
    assert.strictEqual(result.length, 2);
    const resultKeys = result.map(c => c.key);
    assert.ok(resultKeys.includes("manage-work-request"));
    assert.ok(resultKeys.includes("issue-invoice"));
  });

  await t.test("listRelatedCapabilities returns empty list for missing target key", () => {
    assert.strictEqual(listRelatedCapabilities(MOCK_CATALOG, "").length, 0);
  });

  await t.test("listRelatedCapabilities returns empty list for non-existing target key", () => {
    // The target capability doesn't exist, so there are no forward links.
    // Also no other capability has reverse links to "non-existing".
    assert.strictEqual(listRelatedCapabilities(MOCK_CATALOG, "non-existing").length, 0);
  });
});
