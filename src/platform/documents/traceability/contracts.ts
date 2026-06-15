import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  CorrelationIdSchema,
  CausationIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "../../contracts";

/**
 * Subject Types
 */
export const TraceReceiptSubjectTypeSchema = z.enum([
  "process",
  "process_instance",
  "action_execution",
  "document",
  "asset",
  "work_request",
  "form",
  "notification",
  "custom",
]);

/**
 * TraceReceiptSubject
 */
export const TraceReceiptSubjectSchema = z
  .object({
    type: TraceReceiptSubjectTypeSchema,
    id: EntityIdSchema,
    category: z.string().min(1).optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.type === "custom") {
        return !!data.category;
      }
      return true;
    },
    {
      message: "Category is required for 'custom' subject type",
      path: ["category"],
    }
  );

export type TraceReceiptSubject = z.infer<typeof TraceReceiptSubjectSchema>;

/**
 * Actor Types
 */
export const TraceReceiptActorTypeSchema = z.enum([
  "user",
  "service",
  "agent",
  "system",
  "external",
]);

/**
 * TraceReceiptActor
 */
export const TraceReceiptActorSchema = z
  .object({
    type: TraceReceiptActorTypeSchema,
    id: EntityIdSchema,
    name: z.string().min(1).optional(),
  })
  .strict();

export type TraceReceiptActor = z.infer<typeof TraceReceiptActorSchema>;

/**
 * Action Results
 */
export const TraceReceiptActionResultSchema = z.enum([
  "success",
  "failure",
  "partial",
  "cancelled",
]);

/**
 * TraceReceiptAction
 */
export const TraceReceiptActionSchema = z
  .object({
    type: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    result: TraceReceiptActionResultSchema,
  })
  .strict();

export type TraceReceiptAction = z.infer<typeof TraceReceiptActionSchema>;

/**
 * Hash Algorithms and Scopes
 */
export const TraceReceiptHashAlgorithmSchema = z.enum(["sha256", "sha512"]);
export const TraceReceiptHashScopeSchema = z.enum([
  "receipt",
  "artifact",
  "payload",
  "document",
]);

/**
 * TraceReceiptHash
 */
export const TraceReceiptHashSchema = z
  .object({
    algorithm: TraceReceiptHashAlgorithmSchema,
    scope: TraceReceiptHashScopeSchema,
    value: z.string().regex(/^[a-f0-9]+$/),
  })
  .strict()
  .refine(
    (data) => {
      if (data.algorithm === "sha256") return data.value.length === 64;
      if (data.algorithm === "sha512") return data.value.length === 128;
      return false;
    },
    {
      message: "Hash value length does not match algorithm requirements",
      path: ["value"],
    }
  );

export type TraceReceiptHash = z.infer<typeof TraceReceiptHashSchema>;

/**
 * TraceReceiptArtifact
 */
export const TraceReceiptArtifactSchema = z
  .object({
    id: EntityIdSchema,
    name: z.string().min(1),
    mediaType: z.string().min(1),
    uri: z.string().url().refine((val) => {
      const allowedProtocols = ["https:", "s3:", "minio:", "file:", "urn:"];
      return allowedProtocols.some((protocol) => val.startsWith(protocol));
    }, {
      message: "URI must use one of the allowed protocols: https, s3, minio, file, urn",
    }),
    size: z.number().int().nonnegative(),
    hashReference: z.string().min(1).optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();

export type TraceReceiptArtifact = z.infer<typeof TraceReceiptArtifactSchema>;

/**
 * TraceReceiptSource
 */
export const TraceReceiptSourceSchema = z
  .object({
    system: z.string().min(1),
    version: z.string().min(1),
    environment: z.string().min(1).optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();

export type TraceReceiptSource = z.infer<typeof TraceReceiptSourceSchema>;

/**
 * TraceReceipt
 */
export const TraceReceiptSchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    subject: TraceReceiptSubjectSchema,
    actor: TraceReceiptActorSchema,
    action: TraceReceiptActionSchema,
    timestamp: ISODateTimeSchema,
    source: TraceReceiptSourceSchema,
    artifacts: z.array(TraceReceiptArtifactSchema),
    hashes: z.array(TraceReceiptHashSchema),
    correlationId: CorrelationIdSchema,
    previousReceiptId: EntityIdSchema.optional(),
    causationId: CausationIdSchema.optional(),
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();

export type TraceReceipt = z.infer<typeof TraceReceiptSchema>;

/**
 * TraceReceiptVerificationResult
 */
export const TraceReceiptVerificationResultSchema = z
  .object({
    valid: z.boolean(),
    timestamp: ISODateTimeSchema,
    details: UnknownRecordSchema.optional(),
  })
  .strict();

export type TraceReceiptVerificationResult = z.infer<
  typeof TraceReceiptVerificationResultSchema
>;
