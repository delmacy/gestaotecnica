import { z } from "zod";

// Origin Model
export const SIGNAL_ORIGINS = [
  "manual",
  "agent",
  "integration",
  "imported",
] as const;

export const signalOriginSchema = z.enum(SIGNAL_ORIGINS);
export type SignalOrigin = z.infer<typeof signalOriginSchema>;

// Informal Signal
export const informalSignalSchema = z.object({
  candidateId: z.string().uuid(),
  formDefinitionId: z.string().uuid(),
  origin: signalOriginSchema,
  originalText: z.string(),
  structuredData: z.record(z.string(), z.unknown()).optional(),
  submittedAt: z.date().optional(),
});
export type InformalSignal = z.infer<typeof informalSignalSchema>;

// Form Field Configurations
export const textFieldConfigSchema = z.object({
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional(),
});
export type TextFieldConfig = z.infer<typeof textFieldConfigSchema>;

export const dropdownFieldConfigSchema = z.object({
  options: z.array(z.string()).min(1),
});
export type DropdownFieldConfig = z.infer<typeof dropdownFieldConfigSchema>;

export const originFieldConfigSchema = z.object({});
export type OriginFieldConfig = z.infer<typeof originFieldConfigSchema>;

export const fieldConfigSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), config: textFieldConfigSchema.optional() }),
  z.object({ type: z.literal("dropdown"), config: dropdownFieldConfigSchema }),
  z.object({ type: z.literal("origin"), config: originFieldConfigSchema.optional() }),
]);

// Form Field Definition
export const formFieldDefinitionSchema = z.intersection(
  z.object({
    key: z.string().min(1),
    label: z.string(),
    required: z.boolean(),
    description: z.string().optional(),
    defaultValue: z.unknown().optional(),
  }),
  fieldConfigSchema
);
export type FormFieldDefinition = z.infer<typeof formFieldDefinitionSchema>;

// Form Definition
export const formDefinitionSchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string().uuid(),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.number().int().min(1),
  fields: z.array(formFieldDefinitionSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type FormDefinition = z.infer<typeof formDefinitionSchema>;

// Form Submission
export const formSubmissionSchema = z.object({
  candidateId: z.string().uuid(),
  formDefinitionId: z.string().uuid(),
  origin: signalOriginSchema,
  originalText: z.string(),
  data: z.record(z.string(), z.unknown()),
  submittedAt: z.date(),
});
export type FormSubmission = z.infer<typeof formSubmissionSchema>;

// Form Validation Types
export const formValidationIssueSchema = z.object({
  code: z.string(),
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
});
export type FormValidationIssue = z.infer<typeof formValidationIssueSchema>;

export type FormValidationResult =
  | { valid: true }
  | { valid: false; issues: FormValidationIssue[] };
