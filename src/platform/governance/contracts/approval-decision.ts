import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ActorReferenceSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "../../contracts";
import { TraceReceiptHashSchema } from "../../documents/traceability/contracts";

/**
 * Recursive freeze function to ensure deep immutability.
 */
function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  });
  return obj;
}

/**
 * Approval Decision Values
 * Represents the semantic result of an approval decision.
 */
export const ApprovalDecisionValueSchema = z.enum([
  "approved",
  "rejected",
  "changes_requested",
]);
export type ApprovalDecisionValue = z.infer<typeof ApprovalDecisionValueSchema>;

/**
 * Approval Subject Types
 * Restricted to assets that actually exist in the platform.
 */
export const ApprovalSubjectTypeSchema = z.enum([
  "process_version",
  "form_definition",
  "utility_app_definition",
]);
export type ApprovalSubjectType = z.infer<typeof ApprovalSubjectTypeSchema>;

/**
 * Approval Subject Reference
 * Points to the exact version of the asset being decided upon.
 */
export const ApprovalSubjectReferenceSchema = z
  .object({
    type: ApprovalSubjectTypeSchema,
    id: EntityIdSchema,
    version: z.union([z.string().min(1), z.number().int().positive()]).optional(),
  })
  .strict();
export type ApprovalSubjectReference = z.infer<typeof ApprovalSubjectReferenceSchema>;

/**
 * Approved Content Hash
 * Evidence of the exact content evaluated by the decider.
 * Uses TraceReceiptHashSchema for consistency in hashing requirements.
 */
export const ApprovedContentHashSchema = TraceReceiptHashSchema;
export type ApprovedContentHash = z.infer<typeof ApprovedContentHashSchema>;

/**
 * Approval Decision Schema
 * Canonical contract representing a semantic approval decision.
 */
export const ApprovalDecisionSchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    subject: ApprovalSubjectReferenceSchema,
    decision: ApprovalDecisionValueSchema,
    actor: ActorReferenceSchema,
    policyId: EntityIdSchema.optional(),
    justification: z
      .string()
      .trim()
      .min(10, { message: "Justification must have at least 10 useful characters" })
      .max(2000)
      .optional(),
    approvedContentHash: ApprovedContentHashSchema.optional(),
    decidedAt: ISODateTimeSchema,
    metadata: UnknownRecordSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (
      (data.decision === "rejected" || data.decision === "changes_requested") &&
      (!data.justification || data.justification.trim().length < 10)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Justification is mandatory and must have at least 10 characters when decision is '${data.decision}'`,
        path: ["justification"],
      });
    }
  })
  .transform((data) => deepFreeze(data));

export type ApprovalDecision = z.infer<typeof ApprovalDecisionSchema>;
