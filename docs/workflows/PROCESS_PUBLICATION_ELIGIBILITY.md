# Process Publication Eligibility Gate

## Overview

The `evaluateProcessPublicationEligibility` service is a pure domain service responsible for determining if a `ProcessVersion` is ready to be published. It aggregates structural, semantic, and governance rules without side effects.

## Eligibility Criteria

A process version is eligible for publication if and only if:
1. **Status is 'draft'**: Only draft versions can transition to 'published'.
2. **Graph is Semantically Valid**: The process graph must pass all semantic checks (e.g., exactly one start node, at least one end node, no dead ends, no unreachable nodes). Warnings (like cycle detection) do not block publication.
3. **Approval Requirements are Satisfied**: If an applicable approval policy exists, it must be fully satisfied by valid approval decisions.

## Result Structure

The service returns a structured result:

```typescript
{
  eligible: boolean;           // Overall result
  graphValid: boolean;         // Semantic graph validation status
  approvalApplicable: boolean; // Whether an approval policy was applied
  approvalSatisfied: boolean;  // Whether approval requirements were met
  reasons: Array<{             // Detailed reasons for ineligibility
    code: string;
    message: string;
    source: "graph" | "approval" | "version";
    nodeId?: string;
    edgeId?: string;
  }>;
  countedDecisionIds: string[]; // IDs of decisions that satisfied the policy
  ignoredDecisionIds: string[]; // IDs of decisions that were filtered out
}
```

## Policy for Missing or Non-Applicable Policies

- **No Policy Provided**: If no policy is passed to the evaluator, the process is considered eligible for publication as long as the status and graph are valid.
- **Non-Applicable Policy**: If a policy is provided but its scope doesn't match the operation (`publish`) or subject, it is treated as if no policy was provided (does not block publication).
- **Applicable Policy**: If a policy matches the scope, `approvalSatisfied` must be `true` for the version to be eligible.

## Usage

```typescript
const result = evaluateProcessPublicationEligibility({
  envelope,
  policy,
  decisions,
  actorRolesByActorId
});
```
