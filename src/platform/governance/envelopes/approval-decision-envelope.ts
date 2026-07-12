import { z } from "zod";
import { ApprovalActorSchema, ApprovalSubjectReferenceSchema } from "../contracts/approval-decision";
import { ISODateTimeSchema } from "../../contracts";

/**
 * Valid intent actions for a decision.
 */
export const ApprovalDecisionEnvelopeTypeSchema = z.enum([
  "approve",
  "reject",
  "request_changes",
  "cancel",
]);
export type ApprovalDecisionEnvelopeType = z.infer<typeof ApprovalDecisionEnvelopeTypeSchema>;

/**
 * Envelope representing an incoming approval decision.
 */
export const ApprovalDecisionEnvelopeSchema = z
  .object({
    decision: ApprovalDecisionEnvelopeTypeSchema,
    actor: ApprovalActorSchema,
    timestamp: ISODateTimeSchema,
    target: ApprovalSubjectReferenceSchema,
    reason: z.string().optional(),
  })
  .strict();

export type ApprovalDecisionEnvelope = z.infer<typeof ApprovalDecisionEnvelopeSchema>;
