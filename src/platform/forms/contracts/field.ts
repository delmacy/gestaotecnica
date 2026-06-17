import { z } from "zod";

export const FormFieldTypeSchema = z.enum([
  "text",
  "textarea",
  "number",
  "boolean",
  "date",
  "datetime",
  "select",
  "multiselect",
  "radio",
  "checkbox",
  "file",
  "reference",
]);

export type FormFieldType = z.infer<typeof FormFieldTypeSchema>;

export const ValidationRuleSchema = z.object({
  type: z.enum([
    "required",
    "min",
    "max",
    "minLength",
    "maxLength",
    "pattern",
    "enum",
    "custom",
  ]),
  value: z.unknown().optional(),
  message: z.string().optional(),
  customRuleReference: z.string().optional(),
});

export type ValidationRule = z.infer<typeof ValidationRuleSchema>;

export const VisibilityOperatorSchema = z.enum([
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contains",
  "exists",
]);

export const VisibilityRuleSchema = z.object({
  fieldReference: z.string(),
  operator: VisibilityOperatorSchema,
  expectedValue: z.unknown().optional(),
});

export type VisibilityRule = z.infer<typeof VisibilityRuleSchema>;

export const FieldOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export type FieldOption = z.infer<typeof FieldOptionSchema>;

export const FieldDefinitionSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  type: FormFieldTypeSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: z.unknown().optional(),
  placeholder: z.string().optional(),
  validation: z.array(ValidationRuleSchema).default([]),
  visibility: z.array(VisibilityRuleSchema).default([]),
  options: z.array(FieldOptionSchema).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type FieldDefinition = z.infer<typeof FieldDefinitionSchema>;

export function validateFieldIntegrity(field: FieldDefinition): string[] {
  const errors: string[] = [];

  // Type compatibility for defaultValue
  if (field.defaultValue !== undefined && field.defaultValue !== null) {
    const val = field.defaultValue;
    switch (field.type) {
      case "number":
        if (typeof val !== "number") errors.push(`Field "${field.key}": defaultValue must be a number`);
        break;
      case "boolean":
        if (typeof val !== "boolean") errors.push(`Field "${field.key}": defaultValue must be a boolean`);
        break;
      case "date":
      case "datetime":
      case "text":
      case "textarea":
      case "select":
      case "radio":
        if (typeof val !== "string") errors.push(`Field "${field.key}": defaultValue must be a string`);
        break;
      case "multiselect":
      case "checkbox":
        if (!Array.isArray(val)) errors.push(`Field "${field.key}": defaultValue must be an array`);
        break;
    }
  }

  // Options compatibility
  if (["select", "multiselect", "radio", "checkbox"].includes(field.type)) {
    if (!field.options || field.options.length === 0) {
      errors.push(`Field "${field.key}": type "${field.type}" requires non-empty options`);
    }
  }

  return errors;
}
