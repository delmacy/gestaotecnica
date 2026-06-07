import { z } from 'zod';

export const RuleConditionOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'greater_than',
  'greater_than_or_equal',
  'less_than',
  'less_than_or_equal',
  'contains',
  'in',
  'exists',
]);

export type RuleConditionOperator = z.infer<typeof RuleConditionOperatorSchema>;

export const RuleConditionSchema = z.object({
  path: z.string().min(1, 'Condition must have a path'),
  operator: RuleConditionOperatorSchema,
  value: z.unknown().optional(),
});

export type RuleCondition = z.infer<typeof RuleConditionSchema>;

export const RuleConditionGroupTypeSchema = z.enum(['all', 'any']);

export type RuleConditionGroupType = z.infer<typeof RuleConditionGroupTypeSchema>;

export type RuleConditionGroup = {
  type: RuleConditionGroupType;
  conditions: (RuleCondition | RuleConditionGroup)[];
};

export const RuleConditionGroupSchema: z.ZodType<RuleConditionGroup> = z.lazy(() =>
  z.object({
    type: RuleConditionGroupTypeSchema,
    conditions: z.array(z.union([RuleConditionSchema, RuleConditionGroupSchema])).min(1, 'Group must have conditions'),
  })
);

export const RuleEffectTypeSchema = z.enum([
  'require_approval',
  'reject',
  'allow',
  'request_information',
  'wait_until',
]);

export type RuleEffectType = z.infer<typeof RuleEffectTypeSchema>;

export const RuleEffectSchema = z.object({
  type: RuleEffectTypeSchema,
  payload: z.unknown().optional(),
});

export type RuleEffect = z.infer<typeof RuleEffectSchema>;

export const RuleStatusSchema = z.enum(['draft', 'active', 'inactive']);

export type RuleStatus = z.infer<typeof RuleStatusSchema>;

export const RuleDefinitionSchema = z.object({
  id: z.string().min(1, 'Rule must have an id'),
  key: z.string().min(1, 'Rule must have a key'),
  name: z.string().min(1, 'Rule must have a name'),
  description: z.string().optional(),
  status: RuleStatusSchema,
  priority: z.number().int().nonnegative('Priority must be a non-negative integer'),
  condition: z.union([RuleConditionSchema, RuleConditionGroupSchema]),
  effects: z.array(RuleEffectSchema).min(1, 'Rule must have at least one effect'),
  version: z.string().optional(),
  authorId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type RuleDefinition = z.infer<typeof RuleDefinitionSchema>;

export const ApprovalRequirementSchema = z.object({
  role: z.string().optional(),
  userId: z.string().optional(),
  description: z.string().optional(),
});

export type ApprovalRequirement = z.infer<typeof ApprovalRequirementSchema>;

export const ApprovalPolicySchema = z.object({
  approvers: z.array(ApprovalRequirementSchema).min(1, 'Policy must have approvers'),
  minApprovals: z.number().int().positive('Minimum approvals must be a positive integer'),
  requireUnanimous: z.boolean().optional(),
  requireJustification: z.boolean().optional(),
  timeoutDurationMs: z.number().int().positive('Timeout must be a positive duration').optional(),
  timeoutEffect: RuleEffectTypeSchema.optional(),
  order: z.number().int().optional(),
});

export type ApprovalPolicy = z.infer<typeof ApprovalPolicySchema>;

export type RuleEvaluationContext = {
  timestamp: string; // ISO 8601 representation of explicit instant
  data: Record<string, unknown>;
  candidateId?: string;
};

export type RuleValidationIssue = {
  code: string;
  message: string;
  path?: (string | number)[];
};

export type RuleValidationResult = {
  ok: boolean;
  issues?: RuleValidationIssue[];
};

export type RuleEvaluationResult = {
  rule: RuleDefinition;
  matched: boolean;
  conditionsEvaluated: number;
  recommendedEffects: RuleEffect[];
  issues?: string[];
};
