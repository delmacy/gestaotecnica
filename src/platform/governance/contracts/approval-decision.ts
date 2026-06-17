import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ActorReferenceSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "../../contracts";
import { TraceReceiptHashAlgorithmSchema } from "../../documents/traceability/contracts";

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
 * Version is mandatory to ensure decisions apply to an exact state.
 */
export const ApprovalSubjectReferenceSchema = z
  .object({
    type: ApprovalSubjectTypeSchema,
    id: EntityIdSchema,
    version: z.union([z.string().min(1), z.number().int().positive()]),
  })
  .strict();
export type ApprovalSubjectReference = z.infer<typeof ApprovalSubjectReferenceSchema>;

/**
 * Approved Content Hash
 * Evidence of the exact content evaluated by the decider.
 * Independent of TraceReceipt scope semantics.
 */
export const ApprovedContentHashSchema = z
  .object({
    algorithm: TraceReceiptHashAlgorithmSchema,
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
  });

export type ApprovalDecision = z.infer<typeof ApprovalDecisionSchema>;
