import type { ActionJsonSchema, ActionSchemaProperty } from "./action-types";

export const uuidProperty = (description?: string): ActionSchemaProperty => ({
  type: "string",
  format: "uuid",
  description,
});

export const stringProperty = (description?: string): ActionSchemaProperty => ({
  type: "string",
  description,
});

export const booleanProperty = (description?: string): ActionSchemaProperty => ({
  type: "boolean",
  description,
});

export const objectProperty = (description?: string): ActionSchemaProperty => ({
  type: "object",
  description,
});

export const enumProperty = (
  values: string[],
  description?: string,
): ActionSchemaProperty => ({
  type: "string",
  enum: values,
  description,
});

export function actionObjectSchema(
  properties: ActionJsonSchema["properties"],
  required: string[] = [],
  description?: string,
): ActionJsonSchema {
  return {
    type: "object",
    description,
    required,
    properties,
    additionalProperties: false,
  };
}

export const idTitleOutputSchema = actionObjectSchema({
  id: uuidProperty("Identificador interno."),
  title: stringProperty("Título retornado pela action."),
});
