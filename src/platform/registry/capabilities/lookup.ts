import { Capability, CapabilityDomain, CapabilityGroup } from "./schemas";

/**
 * Helper to safely read tags from capability metadata.
 */
function readCapabilityTags(capability: Capability): readonly string[] {
  const metadata = capability.metadata;

  if (
    typeof metadata !== "object" ||
    metadata === null ||
    !("tags" in metadata)
  ) {
    return [];
  }

  const tags = (metadata as Record<string, unknown>).tags;

  return Array.isArray(tags)
    ? tags.filter((tag): tag is string => typeof tag === "string")
    : [];
}

/**
 * Finds a capability by its unique key.
 *
 * @param catalog - The capability catalog array.
 * @param key - The exact key to find.
 * @returns The found capability or undefined.
 */
export function findCapabilityByKey(catalog: Capability[], key: string): Capability | undefined {
  return catalog.find((cap) => cap.key === key);
}

/**
 * Lists all capabilities in a given domain.
 *
 * @param catalog - The capability catalog array.
 * @param domain - The exact domain literal.
 * @returns A new array with the filtered capabilities, maintaining original order.
 */
export function listCapabilitiesByDomain(catalog: Capability[], domain: CapabilityDomain): Capability[] {
  return catalog.filter((cap) => cap.domain === domain);
}

/**
 * Lists all capabilities in a given group.
 *
 * @param catalog - The capability catalog array.
 * @param group - The exact group literal.
 * @returns A new array with the filtered capabilities, maintaining original order.
 */
export function listCapabilitiesByGroup(catalog: Capability[], group: CapabilityGroup): Capability[] {
  return catalog.filter((cap) => cap.group === group);
}

/**
 * Returns true if the catalog contains a capability with the given key.
 *
 * @param catalog - The capability catalog array.
 * @param key - The exact key to check.
 * @returns True if found, false otherwise.
 */
export function hasCapability(catalog: Capability[], key: string): boolean {
  return catalog.some((cap) => cap.key === key);
}

/**
 * Returns capabilities whose dependencies array includes the exact target capability key.
 *
 * @param catalog - The capability catalog array.
 * @param targetKey - The exact dependency key to search for.
 * @returns A new array of capabilities that directly depend on the target capability.
 */
export function listDependentCapabilities(catalog: Capability[], targetKey: string): Capability[] {
  if (!targetKey) {
    return [];
  }
  return catalog.filter((cap) => cap.dependencies?.includes(targetKey));
}

/**
 * Searches for capabilities by key, name, description, or tags.
 *
 * Rules:
 * - case-insensitive
 * - trim of the query
 * - empty query returns full catalog in new array
 * - no fuzzy matching (uses substring match)
 * - original order preserved
 *
 * @param catalog - The capability catalog array.
 * @param query - The search string.
 * @returns A new array with matching capabilities.
 */
export function searchCapabilities(catalog: Capability[], query: string): Capability[] {
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery === "") {
    return [...catalog];
  }

  return catalog.filter((cap) => {
    const keyMatch = cap.key.toLowerCase().includes(trimmedQuery);
    const nameMatch = cap.name.toLowerCase().includes(trimmedQuery);
    const descriptionMatch = cap.description.toLowerCase().includes(trimmedQuery);

    const tags = readCapabilityTags(cap);
    const tagsMatch = tags.some((tag) =>
      tag.toLowerCase().includes(trimmedQuery)
    );

    return keyMatch || nameMatch || descriptionMatch || tagsMatch;
  });
}
