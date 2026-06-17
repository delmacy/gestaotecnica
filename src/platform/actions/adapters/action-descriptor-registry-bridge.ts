import { z } from "zod";
import { ActionDescriptor, ActionDescriptorSchema } from "../contracts/action-descriptor";
import { ActionDefinition } from "../action-types";
import { checkSafety } from "../contracts/safe-traversal";

export interface ActionDescriptorCompatibilityIssue {
  code: string;
  message: string;
  path?: string[];
}

export interface ActionDescriptorCompatibilityReport {
  compatible: boolean;
  issues: ActionDescriptorCompatibilityIssue[];
}

/**
 * Converts an ActionDefinition to an ActionDescriptor.
 * Implementation of PKG-ACTION-DESCRIPTOR-REGISTRY-BRIDGE-001.
 *
 * @param definition The executable action definition
 * @returns A validated ActionDescriptor
 * @throws Error if the definition cannot be converted to a valid descriptor
 */
export function toActionDescriptor(definition: ActionDefinition): ActionDescriptor {
  const descriptorData = {
    key: definition.key,
    name: definition.uiLabel || definition.key,
    description: (definition.description || definition.uiDescription)?.slice(0, 2000),
    handlerKey: definition.key, // Policy: Reuse definition key as handlerKey
    inputSchema: definition.inputSchema ?? { type: "object", properties: {} },
    outputSchema: definition.outputSchema ?? { type: "object", properties: {} },
    idempotent: definition.idempotent,
    tags: [],
  };

  const result = ActionDescriptorSchema.safeParse(descriptorData);

  if (!result.success) {
    const errors = result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`ActionDefinition "${definition.key}" is incompatible with ActionDescriptor: ${errors}`);
  }

  return result.data;
}

/**
 * Validates a descriptor against a definition to ensure they are compatible.
 */
export function validateDescriptorAgainstDefinition(
  descriptor: ActionDescriptor,
  definition: ActionDefinition
): ActionDescriptorCompatibilityReport {
  const issues: ActionDescriptorCompatibilityIssue[] = [];

  // 1. Key compatibility
  if (descriptor.key !== definition.key) {
    issues.push({
      code: "KEY_MISMATCH",
      message: `Descriptor key "${descriptor.key}" does not match definition key "${definition.key}"`,
      path: ["key"],
    });
  }

  // 2. handlerKey identity policy
  if (descriptor.handlerKey !== definition.key) {
    issues.push({
      code: "HANDLER_KEY_MISMATCH",
      message: `Descriptor handlerKey "${descriptor.handlerKey}" does not match executable identity "${definition.key}"`,
      path: ["handlerKey"],
    });
  }

  // 3. Schema safety and compatibility
  // We check safety specifically as requested
  const inputSafety = checkSafety(descriptor.inputSchema);
  if (!inputSafety.isSafe) {
    issues.push({
      code: "UNSAFE_INPUT_SCHEMA",
      message: `Input schema is unsafe: ${inputSafety.reason}`,
      path: ["inputSchema"],
    });
  }

  const outputSafety = checkSafety(descriptor.outputSchema);
  if (!outputSafety.isSafe) {
    issues.push({
      code: "UNSAFE_OUTPUT_SCHEMA",
      message: `Output schema is unsafe: ${outputSafety.reason}`,
      path: ["outputSchema"],
    });
  }

  // 4. Structural comparison (basic check)
  // If both are present, they should ideally be equivalent
  if (definition.inputSchema && JSON.stringify(descriptor.inputSchema) !== JSON.stringify(definition.inputSchema)) {
    issues.push({
      code: "INPUT_SCHEMA_INCOMPATIBLE",
      message: "Descriptor input schema differs from definition input schema",
      path: ["inputSchema"],
    });
  }

  if (definition.outputSchema && JSON.stringify(descriptor.outputSchema) !== JSON.stringify(definition.outputSchema)) {
    issues.push({
      code: "OUTPUT_SCHEMA_INCOMPATIBLE",
      message: "Descriptor output schema differs from definition output schema",
      path: ["outputSchema"],
    });
  }

  return {
    compatible: issues.length === 0,
    issues,
  };
}

/**
 * Creates a deterministic snapshot of all action descriptors from a list of definitions.
 */
export function createActionCatalogSnapshot(
  definitions: readonly ActionDefinition[]
): ActionDescriptor[] {
  // Sort by key to ensure determinism
  return [...definitions]
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(toActionDescriptor);
}
