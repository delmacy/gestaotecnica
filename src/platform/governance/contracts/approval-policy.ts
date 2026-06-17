import { z } from "zod";
import {
  EntityIdSchema,
  WorkspaceIdSchema,
  ISODateTimeSchema,
  UnknownRecordSchema,
} from "../../contracts";
import { ApprovalSubjectTypeSchema } from "./approval-decision";

/**
 * Approval Policy Status
 */
export const ApprovalPolicyStatusSchema = z.enum(["draft", "active", "archived"]);
export type ApprovalPolicyStatus = z.infer<typeof ApprovalPolicyStatusSchema>;

/**
 * Approval Requirement Mode
 * Defines how many approvals are required.
 */
export const ApprovalRequirementModeSchema = z.enum([
  "none",
  "single",
  "quorum",
  "unanimous",
]);
export type ApprovalRequirementMode = z.infer<typeof ApprovalRequirementModeSchema>;

/**
 * Approval Operation
 * Operations governed by approval policies.
 */
export const ApprovalOperationSchema = z.enum(["publish", "archive"]);
export type ApprovalOperation = z.infer<typeof ApprovalOperationSchema>;

/**
 * Approver Requirement
 * Defines the criteria for fulfilling an approval requirement.
 */
export const ApproverRequirementSchema = z
  .object({
    mode: ApprovalRequirementModeSchema,
    minimumApprovals: z.number().int().positive().optional(),
    approverRoles: z
      .array(z.string().trim().min(1).max(100))
      .optional()
      .refine(
        (roles) => !roles || new Set(roles).size === roles.length,
        { message: "approverRoles must contain unique values" }
      ),
  })
  .strict()
  .superRefine((data, ctx) => {
    const { mode, minimumApprovals } = data;

    if (mode === "none") {
      if (minimumApprovals !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "minimumApprovals must be absent when mode is 'none'",
          path: ["minimumApprovals"],
        });
      }
    }

    if (mode === "single") {
      if (minimumApprovals !== undefined && minimumApprovals !== 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "minimumApprovals must be 1 or absent when mode is 'single'",
          path: ["minimumApprovals"],
        });
      }
    }

    if (mode === "quorum") {
      if (minimumApprovals === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "minimumApprovals is mandatory when mode is 'quorum'",
          path: ["minimumApprovals"],
        });
      }
    }

    if (mode === "unanimous") {
      if (minimumApprovals !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "minimumApprovals must be absent when mode is 'unanimous'",
          path: ["minimumApprovals"],
        });
      }
    }
  });

export type ApproverRequirement = z.infer<typeof ApproverRequirementSchema>;

/**
 * Approval Policy Scope
 * Defines which subjects and operations this policy applies to.
 */
export const ApprovalPolicyScopeSchema = z
  .object({
    subjectTypes: z
      .array(ApprovalSubjectTypeSchema)
      .min(1)
      .refine((items) => new Set(items).size === items.length, {
        message: "subjectTypes must contain unique values",
      }),
    operations: z
      .array(ApprovalOperationSchema)
      .min(1)
      .refine((items) => new Set(items).size === items.length, {
        message: "operations must contain unique values",
      }),
  })
  .strict();

export type ApprovalPolicyScope = z.infer<typeof ApprovalPolicyScopeSchema>;

/**
 * Approval Policy Schema
 * Canonical contract defining when and how an asset version requires approval.
 */
export const ApprovalPolicySchema = z
  .object({
    id: EntityIdSchema,
    workspaceId: WorkspaceIdSchema,
    key: z
      .string()
      .trim()
      .min(3)
      .max(100)
      .regex(/^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$/, {
        message: "Key must be kebab-case (e.g., 'my-policy-key')",
      }),
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().max(1000).optional(),
    status: ApprovalPolicyStatusSchema,
    scope: ApprovalPolicyScopeSchema,
    requirement: ApproverRequirementSchema,
    createdAt: ISODateTimeSchema,
    updatedAt: ISODateTimeSchema,
    metadata: UnknownRecordSchema.optional(),
  })
  .strict();

export type ApprovalPolicy = z.infer<typeof ApprovalPolicySchema>;
