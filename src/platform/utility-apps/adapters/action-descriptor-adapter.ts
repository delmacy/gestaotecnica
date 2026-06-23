import { UtilityAppActionBinding } from "../contracts/utility-app-action-binding";
import { ActionDescriptor } from "@/platform/actions/contracts/action-descriptor";

export interface BindingResolutionError {
  code: string;
  message: string;
  binding: UtilityAppActionBinding;
}

export interface BindingResolutionResult {
  success: boolean;
  descriptor?: ActionDescriptor;
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

  return {
    success: true,
    descriptor,
  };
}

export function mapInputPayload(
  payload: Record<string, unknown>,
  binding: UtilityAppActionBinding
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  for (const [sourceField, targetField] of Object.entries(binding.mapping)) {
    if (payload[sourceField] !== undefined) {
      mapped[targetField] = payload[sourceField];
    }
  }

  // Preserve unmapped fields as is? We'll only map the defined ones for strictness, but we can pass others if needed.
  // The PR requirements state "adapter puro de input/output com regras para campos ausentes e conflitos".
  // If a source field is absent, it is not mapped.

  return mapped;
}

export function mapOutputPayload(
  payload: Record<string, unknown>,
  binding: UtilityAppActionBinding
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};

  // Create reverse mapping
  const reverseMapping: Record<string, string> = {};
  for (const [sourceField, targetField] of Object.entries(binding.mapping)) {
    reverseMapping[targetField] = sourceField;
  }

  for (const [key, value] of Object.entries(payload)) {
    const targetField = reverseMapping[key];
    if (targetField !== undefined) {
      mapped[targetField] = value;
    } else {
      // Unmapped fields are ignored to prevent leaking unintended data
    }
  }

  return mapped;
}
