import { z } from "zod";
import {
  EntityIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
  WorkspaceIdSchema,
  CorrelationIdSchema,
  CausationIdSchema,
} from "../contracts";

/**
 * PlatformErrorCategorySchema - categories of errors in the platform.
 */
export const PlatformErrorCategorySchema = z.enum([
  "validation",
  "domain",
  "authorization",
  "authentication",
  "not_found",
  "conflict",
  "integration",
  "infrastructure",
  "rate_limit",
  "timeout",
  "unexpected",
]);
export type PlatformErrorCategory = z.infer<typeof PlatformErrorCategorySchema>;

/**
 * PlatformErrorSeveritySchema - severities of errors.
 */
export const PlatformErrorSeveritySchema = z.enum([
  "info",
  "warning",
  "error",
  "critical",
]);
export type PlatformErrorSeverity = z.infer<typeof PlatformErrorSeveritySchema>;

/**
 * PlatformErrorSourceSchema - identifies the source of the error.
 */
export const PlatformErrorSourceSchema = z.object({
  pointer: z.string().optional(),
  parameter: z.string().optional(),
  header: z.string().optional(),
}).strict();
export type PlatformErrorSource = z.infer<typeof PlatformErrorSourceSchema>;

/**
 * ValidationIssueSchema - details about a specific validation failure.
 */
export const ValidationIssueSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  path: z.array(z.string()),
}).strict();
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

/**
 * RetryInstructionSchema - instructions on if and when to retry the operation.
 */
export const RetryInstructionSchema = z.object({
  retryable: z.boolean(),
  afterSeconds: z.number().int().nonnegative().optional(),
}).strict();
export type RetryInstruction = z.infer<typeof RetryInstructionSchema>;

/**
 * PlatformErrorCodeSchema - machine-readable error code.
 * Format: CATEGORY.RESOURCE.REASON
 */
export const PlatformErrorCodeSchema = z.string().regex(/^[A-Z0-9_]+\.[A-Z0-9_]+\.[A-Z0-9_]+$/);
export type PlatformErrorCode = z.infer<typeof PlatformErrorCodeSchema>;

/**
 * PlatformErrorEnvelopeSchema - the canonical error envelope for the platform.
 */
export const PlatformErrorEnvelopeSchema = z.object({
  id: EntityIdSchema,
  code: PlatformErrorCodeSchema,
  category: PlatformErrorCategorySchema,
  severity: PlatformErrorSeveritySchema,
  message: z.string().min(1),
  timestamp: ISODateTimeSchema,
  userMessage: z.string().optional(),
  workspaceId: WorkspaceIdSchema.optional(),
  correlationId: CorrelationIdSchema.optional(),
  causationId: CausationIdSchema.optional(),
  source: PlatformErrorSourceSchema.optional(),
  details: UnknownRecordSchema.optional(),
  validationIssues: z.array(ValidationIssueSchema).optional(),
  retry: RetryInstructionSchema.optional(),
  metadata: UnknownRecordSchema.optional(),
}).strict();
export type PlatformErrorEnvelope = z.infer<typeof PlatformErrorEnvelopeSchema>;
