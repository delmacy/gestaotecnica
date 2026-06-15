import { z } from "zod";

export const StudioFieldTypeSchema = z.enum([
  'text',
  'textarea',
  'number',
  'date',
  'datetime',
  'select',
  'multiselect',
  'checkbox',
  'radio',
  'boolean',
  'file',
  'reference',
]);

export type StudioFieldType = z.infer<typeof StudioFieldTypeSchema>;

export const StudioValidationRuleSchema = z.object({
  type: z.enum(['required', 'min', 'max', 'minLength', 'maxLength', 'pattern', 'enum', 'custom']),
  value: z.unknown().optional(),
  message: z.string().optional(),
  customRuleReference: z.string().optional(),
});

export type StudioValidationRule = z.infer<typeof StudioValidationRuleSchema>;

export const StudioVisibilityRuleSchema = z.object({
  fieldReference: z.string(),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'exists']),
  expectedValue: z.unknown().optional(),
});

export type StudioVisibilityRule = z.infer<typeof StudioVisibilityRuleSchema>;

export const StudioFieldOptionSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export type StudioFieldOption = z.infer<typeof StudioFieldOptionSchema>;

export const StudioFieldStateSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  type: StudioFieldTypeSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean(),
  defaultValue: z.unknown().optional(),
  placeholder: z.string().optional(),
  validation: z.array(StudioValidationRuleSchema),
  visibility: z.array(StudioVisibilityRuleSchema),
  options: z.array(StudioFieldOptionSchema).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type StudioFieldState = z.infer<typeof StudioFieldStateSchema>;

export const StudioLayoutGroupStateSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  fieldReferences: z.array(z.string()),
  columns: z.number().optional(),
});

export type StudioLayoutGroupState = z.infer<typeof StudioLayoutGroupStateSchema>;

export const StudioSectionStateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  groups: z.array(StudioLayoutGroupStateSchema),
});

export type StudioSectionState = z.infer<typeof StudioSectionStateSchema>;

export const StudioLayoutStateSchema = z.object({
  sections: z.array(StudioSectionStateSchema),
});

export type StudioLayoutState = z.infer<typeof StudioLayoutStateSchema>;

export const FormBuilderStudioStateSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  workspaceId: z.string().optional(),
  fields: z.array(StudioFieldStateSchema),
  layout: StudioLayoutStateSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type FormBuilderStudioState = z.infer<typeof FormBuilderStudioStateSchema>;
