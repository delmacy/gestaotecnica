import { z } from "zod";
import {
  EntityIdSchema,
  ISODateTimeSchema,
  WorkspaceIdSchema,
  CorrelationIdSchema,
  CausationIdSchema,
} from "../contracts";
import { UnknownRecordSchema } from "../contracts/payload";

/**
 * PlatformErrorCategory - identifies the high-level category of the error.
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
 * PlatformErrorSeverity - indicates the severity level of the error.
 */
export const PlatformErrorSeveritySchema = z.enum([
  "info",
  "warning",
  "error",
  "critical",
]);
export type PlatformErrorSeverity = z.infer<typeof PlatformErrorSeveritySchema>;

/**
 * PlatformErrorSource - identifies where the error originated.
 */
export const PlatformErrorSourceSchema = z.object({
  pointer: z.string().optional(),
  parameter: z.string().optional(),
  component: z.string().optional(),
});
export type PlatformErrorSource = z.infer<typeof PlatformErrorSourceSchema>;

/**
 * ValidationIssue - detailed information about a specific validation failure.
 */
export const ValidationIssueSchema = z.object({
  path: z.array(z.string()),
  code: z.string(),
  message: z.string(),
});
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;

/**
 * RetryInstruction - information on whether and how to retry the operation.
 */
export const RetryInstructionSchema = z.object({
  retryable: z.boolean(),
  afterSeconds: z.number().optional(),
});
export type RetryInstruction = z.infer<typeof RetryInstructionSchema>;

/**
 * PlatformErrorErrorCode - standard pattern for error codes: CATEGORY.RESOURCE.REASON
 */
export const PlatformErrorErrorCodeSchema = z.string().regex(/^[A-Z0-9_]+\.[A-Z0-9_]+\.[A-Z0-9_]+$/);

/**
 * PlatformErrorEnvelope - the canonical, serializable structure for all platform errors.
 */
export const PlatformErrorEnvelopeSchema = z.object({
  id: EntityIdSchema,
  code: PlatformErrorErrorCodeSchema,
  category: PlatformErrorCategorySchema,
  severity: PlatformErrorSeveritySchema,
  message: z.string(),
  userMessage: z.string().optional(),
  timestamp: ISODateTimeSchema,
  workspaceId: WorkspaceIdSchema.optional(),
  correlationId: CorrelationIdSchema.optional(),
  causationId: CausationIdSchema.optional(),
  source: PlatformErrorSourceSchema.optional(),
  details: UnknownRecordSchema.optional(),
  validationIssues: z.array(ValidationIssueSchema).optional(),
  retry: RetryInstructionSchema.optional(),
  metadata: UnknownRecordSchema.optional(),
});

export type PlatformErrorEnvelope = z.infer<typeof PlatformErrorEnvelopeSchema>;
