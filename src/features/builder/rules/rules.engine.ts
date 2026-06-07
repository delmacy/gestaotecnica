import {
  RuleDefinition,
  RuleDefinitionSchema,
  RuleValidationResult,
  ApprovalPolicy,
  ApprovalPolicySchema,
  RuleEvaluationContext,
  RuleEvaluationResult,
  RuleCondition,
  RuleConditionGroup,
  RuleConditionOperator,
} from './rules.types';

// Utility to safely resolve a path in an object, preventing prototype pollution
export function resolveSafePath(obj: Record<string, unknown>, path: string): unknown {
  if (!obj || typeof obj !== 'object') return undefined;

  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (part === '__proto__' || part === 'prototype' || part === 'constructor') {
      return undefined; // Block dangerous paths
    }

    if (current && typeof current === 'object' && part in current) {
      // safe extraction
      // Use Object.getOwnPropertyDescriptor to check for throwing getters if needed?
      // For now, regular indexing but wrapped in try/catch to avoid malicious getter exceptions crashing the engine
      try {
        current = (current as Record<string, unknown>)[part];
      } catch (e) {
        return undefined; // Getter threw an error
      }
    } else {
      return undefined;
    }
  }

  return current;
}

export function validateRuleDefinition(rule: unknown): RuleValidationResult {
  const result = RuleDefinitionSchema.safeParse(rule);
  if (result.success) {
    // Check maximum depth for group recursively
    const maxDepth = 5;
    const checkDepth = (condition: RuleCondition | RuleConditionGroup, depth: number): boolean => {
      if (depth > maxDepth) return false;
      if ('type' in condition && condition.conditions) {
        if (condition.conditions.length === 0) return false;
        return condition.conditions.every(c => checkDepth(c, depth + 1));
      }
      return true;
    };

    if (!checkDepth(result.data.condition, 1)) {
      return {
        ok: false,
        issues: [{ code: 'invalid_group_depth', message: 'Group is recursively too deep or empty', path: ['condition'] }],
      };
    }

    // Additional path validation
    const validatePaths = (condition: RuleCondition | RuleConditionGroup): boolean => {
       if ('type' in condition && condition.conditions) {
        return condition.conditions.every(c => validatePaths(c));
       } else if ('path' in condition) {
         if (condition.path.includes('__proto__') || condition.path.includes('prototype') || condition.path.includes('constructor')) {
           return false;
         }
       }
       return true;
    };

    if (!validatePaths(result.data.condition)) {
      return {
        ok: false,
        issues: [{ code: 'invalid_path', message: 'Condition path contains forbidden properties', path: ['condition'] }],
      };
    }


    return { ok: true };
  }

  return {
    ok: false,
    issues: !result.success ? (result as any).error.issues.map((err: any) => ({
      code: err.code,
      message: err.message,
      path: err.path,
    })) : [] ,
  };
}

export function validateApprovalPolicy(policy: unknown): RuleValidationResult {
  const result = ApprovalPolicySchema.safeParse(policy);
  if (result.success) {
      if (result.data.minApprovals > result.data.approvers.length) {
          return {
              ok: false,
              issues: [{ code: 'invalid_min_approvals', message: 'Minimum approvals cannot be greater than available approvers', path: ['minApprovals']}]
          }
      }
    return { ok: true };
  }

  return {
    ok: false,
    issues: !result.success ? (result as any).error.issues.map((err: any) => ({
      code: err.code,
      message: err.message,
      path: err.path,
    })) : [] ,
  };
}

function evaluateCondition(condition: RuleCondition, context: RuleEvaluationContext): boolean {
  const value = resolveSafePath(context.data, condition.path);

  switch (condition.operator) {
    case 'exists':
      // Differentiate absence from falsy
      return value !== undefined;
    case 'equals':
      return value === condition.value;
    case 'not_equals':
      return value !== condition.value;
    case 'greater_than':
      if (typeof value !== 'number' || typeof condition.value !== 'number') return false;
      return value > condition.value;
    case 'greater_than_or_equal':
      if (typeof value !== 'number' || typeof condition.value !== 'number') return false;
      return value >= condition.value;
    case 'less_than':
      if (typeof value !== 'number' || typeof condition.value !== 'number') return false;
      return value < condition.value;
    case 'less_than_or_equal':
      if (typeof value !== 'number' || typeof condition.value !== 'number') return false;
      return value <= condition.value;
    case 'contains':
      if (typeof value === 'string' && typeof condition.value === 'string') {
        return value.includes(condition.value);
      }
      if (Array.isArray(value)) {
        return value.includes(condition.value);
      }
      return false;
    case 'in':
      if (!Array.isArray(condition.value)) return false;
      return condition.value.includes(value);
    default:
      return false; // Unknown operator
  }
}

function evaluateGroup(group: RuleConditionGroup, context: RuleEvaluationContext): { matched: boolean, evaluatedCount: number } {
  let evaluatedCount = 0;

  if (group.type === 'all') {
    for (const condition of group.conditions) {
      if ('type' in condition) {
         const res = evaluateGroup(condition, context);
         evaluatedCount += res.evaluatedCount;
         if (!res.matched) return { matched: false, evaluatedCount };
      } else {
         evaluatedCount++;
         if (!evaluateCondition(condition, context)) return { matched: false, evaluatedCount };
      }
    }
    return { matched: true, evaluatedCount };
  } else if (group.type === 'any') {
    for (const condition of group.conditions) {
       if ('type' in condition) {
         const res = evaluateGroup(condition, context);
         evaluatedCount += res.evaluatedCount;
         if (res.matched) return { matched: true, evaluatedCount };
       } else {
         evaluatedCount++;
         if (evaluateCondition(condition, context)) return { matched: true, evaluatedCount };
       }
    }
    return { matched: false, evaluatedCount };
  }

  return { matched: false, evaluatedCount };
}

export function evaluateRule(rule: RuleDefinition, context: RuleEvaluationContext): RuleEvaluationResult {
  if (rule.status !== 'active') {
    return {
      rule,
      matched: false,
      conditionsEvaluated: 0,
      recommendedEffects: [],
      issues: ['Rule is not active'],
    };
  }

  let matched = false;
  let conditionsEvaluated = 0;

  if ('type' in rule.condition) {
    const res = evaluateGroup(rule.condition, context);
    matched = res.matched;
    conditionsEvaluated = res.evaluatedCount;
  } else {
    matched = evaluateCondition(rule.condition, context);
    conditionsEvaluated = 1;
  }

  return {
    rule,
    matched,
    conditionsEvaluated,
    recommendedEffects: matched ? rule.effects : [],
  };
}

export function evaluateRuleSet(rules: RuleDefinition[], context: RuleEvaluationContext): RuleEvaluationResult[] {
  // 1. Prioridade (maior primeiro)
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  const results: RuleEvaluationResult[] = [];

  for (const rule of sortedRules) {
      const result = evaluateRule(rule, context);
      results.push(result);
  }

  // Filter and sort results based on conflict policy: reject > allow
  const hasReject = results.some(r => r.matched && r.recommendedEffects.some(e => e.type === 'reject'));

  if (hasReject) {
      return results.map(r => {
          if (r.matched) {
              return {
                 ...r,
                 recommendedEffects: r.recommendedEffects.filter(e => e.type !== 'allow')
              };
          }
          return r;
      });
  }

  return results;
}
