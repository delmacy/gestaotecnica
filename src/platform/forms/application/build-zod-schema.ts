import { z } from "zod";

export interface FieldDefinition {
  id: string;
  key: string;
  label: string;
  type: string;
  config: Record<string, unknown>;
  isRequired?: boolean;
}

export function buildZodSchema(fields: FieldDefinition[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "number":
        fieldSchema = z.coerce.number();
        break;
      case "boolean":
        fieldSchema = z.boolean();
        break;
      case "date":
        fieldSchema = z.coerce.date();
        break;
      default:
        fieldSchema = z.string();
    }

    if (!field.isRequired) {
      fieldSchema = fieldSchema.optional().nullable();
    } else {
      if (field.type === "text" || field.type === "textarea") {
        fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${field.label} é obrigatório` });
      }
    }

    shape[field.key] = fieldSchema;
  }

  return z.object(shape);
}
