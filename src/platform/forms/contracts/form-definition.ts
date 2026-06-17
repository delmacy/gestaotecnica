import { z } from "zod";
import { FieldDefinitionSchema, validateFieldIntegrity } from "./field";
import { FormLayoutSchema } from "./layout";
import { WorkspaceIdSchema } from "@/platform/contracts/identifiers";

export const FormStatusSchema = z.enum(["draft", "published", "archived"]);
export type FormStatus = z.infer<typeof FormStatusSchema>;

export const FormDefinitionSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.string().min(1),
  status: FormStatusSchema,
  workspace_id: WorkspaceIdSchema.optional(),
  fields: z.array(FieldDefinitionSchema),
  layout: FormLayoutSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
}).refine((data) => {
  for (const field of data.fields) {
    const integrityErrors = validateFieldIntegrity(field);
    if (integrityErrors.length > 0) return false;
  }
  return true;
}, {
  message: "Individual field integrity check failed (e.g. defaultValue/options type mismatch)",
  path: ["fields"],
}).refine((data) => {
  const fieldKeys = new Set<string>();
  const fieldIds = new Set<string>();

  for (const field of data.fields) {
    if (fieldKeys.has(field.key)) return false;
    if (fieldIds.has(field.id)) return false;
    fieldKeys.add(field.key);
    fieldIds.add(field.id);
  }
  return true;
}, {
  message: "Field keys and IDs must be unique within a form",
  path: ["fields"],
}).refine((data) => {
  const fieldIds = new Set(data.fields.map(f => f.id));

  for (const section of data.layout.sections) {
    for (const group of section.groups) {
      for (const fieldRef of group.fieldReferences) {
        if (!fieldIds.has(fieldRef)) return false;
      }
    }
  }
  return true;
}, {
  message: "Layout references non-existent field ID",
  path: ["layout"],
}).refine((data) => {
  const fieldKeys = new Set(data.fields.map(f => f.key));

  for (const field of data.fields) {
    for (const rule of field.visibility) {
      if (!fieldKeys.has(rule.fieldReference)) return false;
    }
  }
  return true;
}, {
  message: "Visibility rule references non-existent field key",
  path: ["fields"],
});

export type FormDefinition = z.infer<typeof FormDefinitionSchema>;
