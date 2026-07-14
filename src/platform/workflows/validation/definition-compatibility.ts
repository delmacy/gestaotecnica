import { ProcessVersion } from "../contracts/process-definition";
import { DefinitionCompatibilityResult } from "../contracts/definition-compatibility-result";

/**
 * Compares two process versions and returns compatibility information.
 *
 * Rules for breaking changes:
 * - Removed node: If a node exists in old version but not in new version.
 * - Changed action: If a node's actionKey changes.
 * - Changed payload: If a node's config changes (basic deep equal check).
 */
export function checkDefinitionCompatibility(
  oldVersion: ProcessVersion,
  newVersion: ProcessVersion
): DefinitionCompatibilityResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const oldNodes = oldVersion.definition.nodes;
  const newNodes = newVersion.definition.nodes;

  const newNodesMap = new Map(newNodes.map(n => [n.id, n]));

  for (const oldNode of oldNodes) {
    const newNode = newNodesMap.get(oldNode.id);

    if (!newNode) {
      blockers.push(`Node removed: ${oldNode.id}`);
      continue;
    }

    if (oldNode.type === "action" && newNode.type === "action") {
       if (oldNode.actionKey !== newNode.actionKey) {
         blockers.push(`Action changed for node: ${oldNode.id}`);
       }
    }

    // Check for config/payload changes
    if (JSON.stringify(oldNode.config) !== JSON.stringify(newNode.config)) {
      blockers.push(`Payload/config changed for node: ${oldNode.id}`);
    }
  }

  return {
    compatible: blockers.length === 0,
    warnings,
    blockers
  };
}
