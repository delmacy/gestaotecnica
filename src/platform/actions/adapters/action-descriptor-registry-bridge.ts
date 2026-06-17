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
  // Safe property access to avoid hostile getter execution
  const getData = <K extends keyof ActionDefinition>(key: K): ActionDefinition[K] | undefined => {
    const desc = Object.getOwnPropertyDescriptor(definition, key);
    return desc && !desc.get && !desc.set ? desc.value : undefined;
  };

  const key = getData("key");
  const uiLabel = getData("uiLabel");
  const description = getData("description");
  const uiDescription = getData("uiDescription");
  const inputSchema = getData("inputSchema");
  const outputSchema = getData("outputSchema");
  const idempotent = getData("idempotent");

  if (typeof key !== "string") {
    throw new Error("ActionDefinition must have a string 'key' data property");
  }

  if (!inputSchema || typeof inputSchema !== "object") {
    throw new Error(`ActionDefinition "${key}" missing or invalid inputSchema`);
  }

  if (!outputSchema || typeof outputSchema !== "object") {
    throw new Error(`ActionDefinition "${key}" missing or invalid outputSchema`);
  }

  const descriptorData = {
    key,
    name: (typeof uiLabel === "string" ? uiLabel : key),
    description: (typeof description === "string" ? description : (typeof uiDescription === "string" ? uiDescription : undefined))?.slice(0, 2000),
    handlerKey: key, // Policy: Reuse definition key as handlerKey
    inputSchema,
    outputSchema,
    idempotent: typeof idempotent === "boolean" ? idempotent : undefined,
    tags: [],
  };

  const result = ActionDescriptorSchema.safeParse(descriptorData);

  if (!result.success) {
    const errors = result.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`ActionDefinition "${key}" is incompatible with ActionDescriptor: ${errors}`);
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

  // Safe property access
  const getData = <K extends keyof ActionDefinition>(key: K): ActionDefinition[K] | undefined => {
    const desc = Object.getOwnPropertyDescriptor(definition, key);
    return desc && !desc.get && !desc.set ? desc.value : undefined;
  };

  const defKey = getData("key");
  const defInputSchema = getData("inputSchema");
  const defOutputSchema = getData("outputSchema");

  // 1. Key compatibility
  if (descriptor.key !== defKey) {
    issues.push({
      code: "KEY_MISMATCH",
      message: `Descriptor key "${descriptor.key}" does not match definition key "${defKey}"`,
      path: ["key"],
    });
  }

  // 2. handlerKey identity policy
  if (descriptor.handlerKey !== defKey) {
    issues.push({
      code: "HANDLER_KEY_MISMATCH",
      message: `Descriptor handlerKey "${descriptor.handlerKey}" does not match executable identity "${defKey}"`,
      path: ["handlerKey"],
    });
  }

  // 3. Schema safety and compatibility
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

  // 4. Structural comparison policy
  // We do not use JSON.stringify for comparison.
  // We return SCHEMA_COMPARISON_UNSUPPORTED if schemas are present to signify
  // that a formal structural equality foundation is required.
  if (defInputSchema || defOutputSchema) {
    issues.push({
      code: "SCHEMA_COMPARISON_UNSUPPORTED",
      message: "Formal structural schema comparison is not yet supported in this bridge.",
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
