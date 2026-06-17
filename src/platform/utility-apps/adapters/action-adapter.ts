import { UtilityAppActionBinding, UtilityAppActionBindingSchema } from "../contracts/utility-app-action-binding";

/**
 * Validates a Utility App Action Binding against its schema.
 */
export function validateUtilityAppActionBinding(binding: unknown): UtilityAppActionBinding {
  return UtilityAppActionBindingSchema.parse(binding);
}

/**
 * Maps Utility App input to Action input based on the binding's inputMapping.
 * Only explicit selections/renamings are allowed.
 */
export function mapUtilityAppInput(
  binding: UtilityAppActionBinding,
  utilityInput: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const mapping = binding.inputMapping || {};

  // Prevent prototype pollution by using a clean object and avoiding __proto__ etc.
  for (const [sourceField, targetField] of Object.entries(mapping)) {
    if (
      targetField === "__proto__" ||
      targetField === "prototype" ||
      targetField === "constructor"
    ) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(utilityInput, sourceField)) {
      result[targetField] = utilityInput[sourceField];
    }
  }

  return result;
}

/**
 * Maps Action output to Utility App output based on the binding's outputMapping.
 * Only explicit selections/renamings are allowed.
 */
export function mapActionOutput(
  binding: UtilityAppActionBinding,
  actionOutput: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const mapping = binding.outputMapping || {};

  for (const [sourceField, targetField] of Object.entries(mapping)) {
    if (
      targetField === "__proto__" ||
      targetField === "prototype" ||
      targetField === "constructor"
    ) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(actionOutput, sourceField)) {
      result[targetField] = actionOutput[sourceField];
    }
  }

  return result;
}
