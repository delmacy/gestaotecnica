import { z } from "zod";
import {
  WorkspaceIdSchema,
  CorrelationIdSchema,
  CausationIdSchema,
  ISODateTimeSchema,
  EntityIdSchema,
} from "../../contracts";

/**
 * TraceReceiptSubject - Discriminated union of entities affected by the receipt.
 */
export const TraceReceiptSubjectSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("process"), id: EntityIdSchema }),
  z.object({ type: z.literal("process_instance"), id: EntityIdSchema }),
  z.object({ type: z.literal("action_execution"), id: EntityIdSchema }),
  z.object({ type: z.literal("document"), id: EntityIdSchema }),
  z.object({ type: z.literal("asset"), id: EntityIdSchema }),
  z.object({ type: z.literal("work_request"), id: EntityIdSchema }),
  z.object({ type: z.literal("form"), id: EntityIdSchema }),
  z.object({ type: z.literal("notification"), id: EntityIdSchema }),
  z.object({ type: z.literal("custom"), id: EntityIdSchema, category: z.string() }),
]);

export type TraceReceiptSubject = z.infer<typeof TraceReceiptSubjectSchema>;

/**
 * TraceReceiptActor - Identity performing the action.
 */
export const TraceReceiptActorTypeSchema = z.enum([
  "user",
  "service",
  "agent",
  "system",
  "external",
]);

export const TraceReceiptActorSchema = z.object({
  type: TraceReceiptActorTypeSchema,
  id: EntityIdSchema,
  name: z.string().optional(),
});

export type TraceReceiptActor = z.infer<typeof TraceReceiptActorSchema>;

/**
 * TraceReceiptAction - Details of the executed action.
 */
export const TraceReceiptActionResultSchema = z.enum([
  "success",
  "failure",
  "partial",
  "cancelled",
]);

export const TraceReceiptActionSchema = z.object({
  type: z.string(),
  name: z.string(),
  description: z.string().optional(),
  result: TraceReceiptActionResultSchema,
});

export type TraceReceiptAction = z.infer<typeof TraceReceiptActionSchema>;

/**
 * TraceReceiptHash - Integrity information.
 */
export const TraceReceiptHashAlgorithmSchema = z.enum(["sha256", "sha512"]);
export type TraceReceiptHashAlgorithm = z.infer<typeof TraceReceiptHashAlgorithmSchema>;

export const TraceReceiptHashScopeSchema = z.enum([
  "receipt",
  "artifact",
  "payload",
  "document",
]);

export const TraceReceiptHashSchema = z.object({
  algorithm: TraceReceiptHashAlgorithmSchema,
  value: z.string().regex(/^[a-f0-9]+$/i, "Must be a hexadecimal string"),
  scope: TraceReceiptHashScopeSchema,
});

export type TraceReceiptHash = z.infer<typeof TraceReceiptHashSchema>;

/**
 * TraceReceiptArtifact - Produced artifact reference.
 */
export const TraceReceiptArtifactSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
  mediaType: z.string(),
  uri: z.string().url(),
  size: z.number().int().nonnegative(),
  hashReference: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TraceReceiptArtifact = z.infer<typeof TraceReceiptArtifactSchema>;

/**
 * TraceReceiptSource - Origin of the evidence.
 */
export const TraceReceiptSourceSchema = z.object({
  origin: z.string(),
  version: z.string().optional(),
  environment: z.string().optional(),
});

export type TraceReceiptSource = z.infer<typeof TraceReceiptSourceSchema>;

/**
 * TraceReceipt - The canonical document trace receipt.
 */
export const TraceReceiptSchema = z.object({
  id: EntityIdSchema,
  workspaceId: WorkspaceIdSchema,
  subject: TraceReceiptSubjectSchema,
  actor: TraceReceiptActorSchema,
  action: TraceReceiptActionSchema,
  timestamp: ISODateTimeSchema,
  source: TraceReceiptSourceSchema,
  artifacts: z.array(TraceReceiptArtifactSchema),
  hashes: z.array(TraceReceiptHashSchema),
  previousReceiptId: EntityIdSchema.optional(),
  correlationId: CorrelationIdSchema,
  causationId: CausationIdSchema.optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TraceReceipt = z.infer<typeof TraceReceiptSchema>;

/**
 * Verification Result.
 */
export const TraceReceiptVerificationResultSchema = z.object({
  valid: z.boolean(),
  timestamp: ISODateTimeSchema,
  details: z.string().optional(),
});

export type TraceReceiptVerificationResult = z.infer<typeof TraceReceiptVerificationResultSchema>;
