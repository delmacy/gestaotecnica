import { UtilityAppActionBinding, UtilityAppActionBindingSchema } from "../contracts/utility-app-action-binding";

/**
 * Validates a Utility App Action Binding against its schema.
 */
export function validateUtilityAppActionBinding(binding: unknown): UtilityAppActionBinding {
  return UtilityAppActionBindingSchema.parse(binding) as UtilityAppActionBinding;
}

/**
 * Maps Utility App input to Action input based on the binding's inputMapping.
 * Only explicit selections/renamings of own data-properties are allowed.
 */
export function mapUtilityAppInput(
  binding: UtilityAppActionBinding,
  utilityInput: Record<string, unknown>
): Record<string, unknown> {
  return applyMapping(binding.inputMapping || {}, utilityInput);
}

/**
 * Maps Action output to Utility App output based on the binding's outputMapping.
 * Only explicit selections/renamings of own data-properties are allowed.
 */
export function mapActionOutput(
  binding: UtilityAppActionBinding,
  actionOutput: Record<string, unknown>
): Record<string, unknown> {
  return applyMapping(binding.outputMapping || {}, actionOutput);
}

/**
 * Internal mapping implementation using own-property descriptors to avoid executing getters.
 * Returns a prototype-less object.
 */
function applyMapping(
  mapping: Record<string, string>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = Object.create(null) as Record<string, unknown>;

  for (const [sourceField, targetField] of Object.entries(mapping)) {
    // 1. Protection against dangerous targets (already checked by schema, but double-guarding)
    if (["__proto__", "prototype", "constructor"].includes(targetField)) {
      continue;
    }

    // 2. Read only own property descriptor to avoid executing getters
    const descriptor = Object.getOwnPropertyDescriptor(source, sourceField);

    if (!descriptor) {
      continue;
    }

    // 3. Reject accessors (getters/setters)
    if (descriptor.get || descriptor.set) {
      throw new Error(`Mapping failed: field "${sourceField}" is an accessor`);
    }

    // 4. Assign value
    result[targetField] = descriptor.value;
  }

  return result;
}
