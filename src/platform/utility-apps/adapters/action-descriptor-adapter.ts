import { UtilityAppActionBinding } from "../contracts/utility-app-action-binding";
import { ActionDescriptor } from "@/platform/actions/contracts/action-descriptor";

export interface BindingResolutionError {
  code: string;
  message: string;
  binding: UtilityAppActionBinding;
  details?: unknown;
}

export interface BindingResolutionResult {
  success: boolean;
  descriptor?: ActionDescriptor;
  errors?: BindingResolutionError[];
}

export interface AdapterMapResult {
  success: boolean;
  payload?: Record<string, unknown>;
  errors?: BindingResolutionError[];
}

export type DescriptorRegistry = {
  getDescriptor: (key: string) => ActionDescriptor | undefined;
};

export function resolveActionBinding(
  binding: UtilityAppActionBinding,
  registry: DescriptorRegistry
): BindingResolutionResult {
  const descriptor = registry.getDescriptor(binding.actionDescriptorKey);

  if (!descriptor) {
    return {
      success: false,
      errors: [
        {
          code: "DESCRIPTOR_NOT_FOUND",
          message: `Action descriptor not found for key: ${binding.actionDescriptorKey}`,
          binding,
        },
      ],
    };
  }

  if (descriptor.status !== "published") {
    return {
      success: false,
      errors: [
        {
          code: "DESCRIPTOR_NOT_PUBLISHED",
          message: `Action descriptor ${binding.actionDescriptorKey} is not in published state`,
          binding,
        },
      ],
    };
  }

  // Detect duplicate targets in mapping
  const targets = new Set<string>();
  for (const target of Object.values(binding.mapping)) {
    if (targets.has(target)) {
      return {
        success: false,
        errors: [{
          code: "DUPLICATE_TARGET_FIELD",
          message: `Target field conflict detected for: ${target}`,
          binding,
        }]
      };
    }
    targets.add(target);
  }

  return {
    success: true,
    descriptor,
  };
}

// Zod validation is used when schemas are available, but ActionDescriptor schema properties are unknown until runtime
// To validate against `descriptor.inputSchema`, we assume it follows the JSON Schema-like Zod parsing if it is a Zod schema
// For this environment, since we use Zod heavily, let's parse using zod if it's available, otherwise check required fields.
import { z } from "zod";

function validateAgainstSchema(schema: unknown, payload: Record<string, unknown>): { success: boolean, details?: unknown } {
  if (!schema || typeof schema !== "object") return { success: true };

  if (schema instanceof z.ZodType) {
    const res = schema.safeParse(payload);
    return { success: res.success, details: res.success ? undefined : res.error.issues };
  }

  // Fallback if schema is JSON Schema object with "required" array
  if ("required" in schema && Array.isArray(schema.required)) {
    const missing = schema.required.filter(key => payload[key] === undefined);
    if (missing.length > 0) {
      return { success: false, details: `Missing required fields: ${missing.join(', ')}` };
    }
  }

  return { success: true };
}

export function mapInputPayload(
  payload: Record<string, unknown>,
  binding: UtilityAppActionBinding,
  descriptor: ActionDescriptor
): AdapterMapResult {
  const mapped: Record<string, unknown> = {};

  for (const [sourceField, targetField] of Object.entries(binding.mapping)) {
    if (sourceField.includes('.') || targetField.includes('.')) {
      return {
        success: false,
        errors: [{
          code: "NESTED_PATHS_NOT_SUPPORTED",
          message: "Nested paths are explicitly not supported in mapping",
          binding
        }]
      }
    }
    if (payload[sourceField] !== undefined) {
      mapped[targetField] = payload[sourceField];
    }
  }

  const validation = validateAgainstSchema(descriptor.inputSchema, mapped);
  if (!validation.success) {
    return {
      success: false,
      errors: [{
        code: "INPUT_SCHEMA_VALIDATION_FAILED",
        message: "Payload failed validation against descriptor inputSchema",
        binding,
        details: validation.details
      }]
    }
  }

  return { success: true, payload: mapped };
}

export function mapOutputPayload(
  payload: Record<string, unknown>,
  binding: UtilityAppActionBinding,
  descriptor: ActionDescriptor
): AdapterMapResult {
  const mapped: Record<string, unknown> = {};

  const reverseMapping: Record<string, string> = {};
  for (const [sourceField, targetField] of Object.entries(binding.mapping)) {
    if (sourceField.includes('.') || targetField.includes('.')) {
      return {
        success: false,
        errors: [{
          code: "NESTED_PATHS_NOT_SUPPORTED",
          message: "Nested paths are explicitly not supported in mapping",
          binding
        }]
      }
    }
    reverseMapping[targetField] = sourceField;
  }

  for (const [key, value] of Object.entries(payload)) {
    const targetField = reverseMapping[key];
    if (targetField !== undefined) {
      mapped[targetField] = value;
    }
  }

  const validation = validateAgainstSchema(descriptor.outputSchema, mapped);
  if (!validation.success) {
    return {
      success: false,
      errors: [{
        code: "OUTPUT_SCHEMA_VALIDATION_FAILED",
        message: "Payload failed validation against descriptor outputSchema",
        binding,
        details: validation.details
      }]
    }
  }

  return { success: true, payload: mapped };
}
