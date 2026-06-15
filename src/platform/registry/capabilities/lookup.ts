import { Capability, CapabilityDomain, CapabilityGroup } from "./schemas";

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

    // Safe access to tags as it's not in the base schema but required by the lookup rules
    const capAsRecord = cap as unknown as Record<string, unknown>;
    const tags = capAsRecord.tags;
    const tagsMatch =
      Array.isArray(tags) &&
      tags.some(
        (tag) => typeof tag === "string" && tag.toLowerCase().includes(trimmedQuery)
      );

    return keyMatch || nameMatch || descriptionMatch || tagsMatch;
  });
}
