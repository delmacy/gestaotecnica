import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
  isSafeJson,
} from "@/platform/contracts";

/**
 * Dataset Status
 * Represents the lifecycle state of the dataset definition.
 */
export const DatasetStatusSchema = z.enum(["draft", "published", "deprecated", "archived"]);
export type DatasetStatus = z.infer<typeof DatasetStatusSchema>;

/**
 * Dataset Kind
 * Represents the nature of the data contained in the dataset.
 *
 * Initial canonical choices:
 * - reference: Master data.
 * - transactional: Event data.
 * - analytical: Speculative (Future extension).
 * - derived: Speculative (Future extension).
 */
export const DatasetKindSchema = z.enum([
  "reference",
  "transactional",
  // "analytical", // Future extension
  // "derived",    // Future extension
]);
export type DatasetKind = z.infer<typeof DatasetKindSchema>;

/**
 * Dataset Refresh Mode
 * Describes the intended method for updating dataset content.
 *
 * Initial canonical choices:
 * - manual: User-triggered.
 * - scheduled: Time-based.
 * - on_demand: Speculative (Future extension).
 * - event_driven: Speculative (Future extension).
 */
export const DatasetRefreshModeSchema = z.enum([
  "manual",
  "scheduled",
  // "on_demand",   // Future extension
  // "event_driven", // Future extension
]);
export type DatasetRefreshMode = z.infer<typeof DatasetRefreshModeSchema>;

/**
 * Dataset Key
 * Rules:
 * - 3 to 100 characters
 * - Starts with lowercase letter
 * - Only a-z, 0-9 and hyphen
 * - No trailing hyphen
 * - No consecutive hyphens
 */
export const DatasetKeySchema = z
  .string()
  .min(3)
  .max(100)
  .regex(/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/);
export type DatasetKey = z.infer<typeof DatasetKeySchema>;

/**
 * Dataset Field Type
 * Supported primitive and structural types for dataset fields.
 */
export const DatasetFieldTypeSchema = z.enum([
  "string",
  "number",
  "boolean",
  "date",
  "datetime",
  "object",
  "array",
]);
export type DatasetFieldType = z.infer<typeof DatasetFieldTypeSchema>;

/**
 * Dataset Field Definition
 * Defines a single field within the dataset's record schema.
 */
export const DatasetFieldSchema = z
  .object({
    key: z
      .string()
      .min(1)
      .max(64)
      .regex(/^[a-z](?:[a-z0-9_])*$/), // Field keys typically use snake_case
    label: z.string().min(1).max(100).optional(),
    type: DatasetFieldTypeSchema,
    required: z.boolean(),
    nullable: z.boolean(),
    description: z.string().max(1000).optional(),
  })
  .strict();
export type DatasetField = z.infer<typeof DatasetFieldSchema>;

/**
 * Dataset Record Schema
 * Defines the overall structure of records in the dataset.
 */
export const DatasetRecordSchemaSchema = z
  .object({
    fields: z
      .array(DatasetFieldSchema)
      .min(1)
      .refine(
        (fields) => {
          const keys = fields.map((f) => f.key);
          return new Set(keys).size === keys.length;
        },
        { message: "Field keys must be unique within a dataset" }
      ),
  })
  .strict();
export type DatasetRecordSchema = z.infer<typeof DatasetRecordSchemaSchema>;

/**
 * Dataset Definition Schema
 * Canonical contract for defining structured data collections.
 * PKG-DATASET-CORE-CONTRACT-001
 */
export const DatasetDefinitionSchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    key: DatasetKeySchema,
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    version: z.number().int().positive(),
    status: DatasetStatusSchema,
    kind: DatasetKindSchema,
    recordSchema: DatasetRecordSchemaSchema,
    refreshMode: DatasetRefreshModeSchema,
    sourceReference: z
      .string()
      .min(1)
      .max(200)
      // Segment-based logical reference: segment(.segment)* or segment/segment
      // Rejects traversals (.), (..), empty segments, and leading/trailing separators.
      .regex(/^[a-z0-9]+(?:[._/-][a-z0-9]+)*$/)
      .optional(),
    tags: z
      .array(z.string().min(1))
      .optional()
      .refine((items) => !items || new Set(items).size === items.length, {
        message: "tags must be unique",
      }),
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
    metadata: z
      .unknown()
      .optional()
      .refine((val) => val === undefined || isSafeJson(val), {
        message: "metadata contains unsafe values (functions, getters, or non-JSON types)",
      }),
  })
  .strict()
  .transform((data) => {
    // The contract guarantees that the input object is not mutated.
    // Object.freeze provides shallow immutability to the top-level structure.
    return Object.freeze(data);
  });

export type DatasetDefinition = z.infer<typeof DatasetDefinitionSchema>;
