import { UtilityAppActionBinding, UtilityAppActionBindingSchema } from "../contracts/utility-app-action-binding";

/**
 * Mapping Issues
 */
export type MappingIssue = {
  code: "ACCESSOR_DETECTED" | "MISSING_FIELD" | "ILLEGAL_TARGET";
  field: string;
  message: string;
};

/**
 * Mapping Result
 */
export type MappingResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; issues: MappingIssue[] };

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
): MappingResult {
  return applyMapping(binding.inputMapping || {}, utilityInput);
}

/**
 * Maps Action output to Utility App output based on the binding's outputMapping.
 * Only explicit selections/renamings of own data-properties are allowed.
 */
export function mapActionOutput(
  binding: UtilityAppActionBinding,
  actionOutput: Record<string, unknown>
): MappingResult {
  return applyMapping(binding.outputMapping || {}, actionOutput);
}

/**
 * Internal mapping implementation using own-property descriptors to avoid executing getters.
 * Returns a prototype-less object.
 */
function applyMapping(
  mapping: Record<string, string>,
  source: Record<string, unknown>
): MappingResult {
  const data = Object.create(null) as Record<string, unknown>;
  const issues: MappingIssue[] = [];

  for (const [sourceField, targetField] of Object.entries(mapping)) {
    // 1. Protection against dangerous targets
    if (["__proto__", "prototype", "constructor"].includes(targetField)) {
      issues.push({
        code: "ILLEGAL_TARGET",
        field: targetField,
        message: `Target field "${targetField}" is illegal`,
      });
      continue;
    }

    // 2. Read only own property descriptor to avoid executing getters
    const descriptor = Object.getOwnPropertyDescriptor(source, sourceField);

    if (!descriptor) {
      continue;
    }

    // 3. Reject accessors (getters/setters)
    if (descriptor.get || descriptor.set) {
      issues.push({
        code: "ACCESSOR_DETECTED",
        field: sourceField,
        message: `Field "${sourceField}" is an accessor and cannot be mapped`,
      });
      continue;
    }

    // 4. Assign value
    data[targetField] = descriptor.value;
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return { success: true, data };
}
