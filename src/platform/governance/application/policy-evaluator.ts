import {
  ApprovalDecision,
  ApprovalDecisionValue,
  ApprovalSubjectReference,
} from "../contracts/approval-decision";
import {
  ApprovalPolicy,
  ApprovalOperation,
} from "../contracts/approval-policy";

export interface ApprovalPolicyEvaluationReason {
  code: string;
  message: string;
}

export interface ApprovalPolicyEvaluationResult {
  satisfied: boolean;
  applicable: boolean;
  countedDecisionIds: string[];
  ignoredDecisionIds: string[];
  reasons: ApprovalPolicyEvaluationReason[];
  requiredApprovals?: number;
  receivedApprovals: number;
}

export interface EvaluateApprovalPolicyOptions {
  policy: ApprovalPolicy;
  decisions: ApprovalDecision[];
  subject: ApprovalSubjectReference;
  operation: ApprovalOperation;
  workspaceId: string;
  actorRolesByActorId?: Record<string, string[]>;
}

/**
 * Pure evaluator for Approval Policies.
 * PKG-APPROVAL-POLICY-EVALUATOR-001
 */
export function evaluateApprovalPolicy(
  options: EvaluateApprovalPolicyOptions
): ApprovalPolicyEvaluationResult {
  const {
    policy,
    decisions,
    subject,
    operation,
    workspaceId,
    actorRolesByActorId = {},
  } = options;

  // 1. Applicability Check
  const isWorkspaceMatch = policy.workspaceId === workspaceId;
  const isSubjectTypeMatch = policy.scope.subjectTypes.includes(subject.type);
  const isOperationMatch = policy.scope.operations.includes(operation);
  const isActive = policy.status === "active";

  const applicable =
    isWorkspaceMatch && isSubjectTypeMatch && isOperationMatch && isActive;

  if (!applicable) {
    const reasons: ApprovalPolicyEvaluationReason[] = [];
    if (!isWorkspaceMatch)
      reasons.push({ code: "WORKSPACE_MISMATCH", message: "Policy workspace mismatch" });
    if (!isSubjectTypeMatch)
      reasons.push({
        code: "SUBJECT_TYPE_MISMATCH",
        message: "Policy subject type mismatch",
      });
    if (!isOperationMatch)
      reasons.push({ code: "OPERATION_MISMATCH", message: "Policy operation mismatch" });
    if (!isActive) reasons.push({ code: "POLICY_INACTIVE", message: "Policy is not active" });

    // Deterministic reasons order
    reasons.sort((a, b) => a.code.localeCompare(b.code));

    return {
      satisfied: false, // PR feedback: non-applicable policy should not be reported as satisfied
      applicable: false,
      countedDecisionIds: [],
      ignoredDecisionIds: [...decisions].map((d) => d.id).sort(),
      reasons,
      receivedApprovals: 0,
    };
  }

  // 2. Decision Filtering
  const relevantDecisions: ApprovalDecision[] = [];
  const initialIgnoredIds: string[] = [];

  for (const d of decisions) {
    const workspaceMatch = d.workspaceId === workspaceId;
    const typeMatch = d.subject.type === subject.type;
    const idMatch = d.subject.id === subject.id;
    const versionMatch = d.subject.version === subject.version;
    // PR feedback: Decisions without policyId must not satisfy that policy.
    const policyIdMatch = d.policyId === policy.id;

    if (workspaceMatch && typeMatch && idMatch && versionMatch && policyIdMatch) {
      relevantDecisions.push(d);
    } else {
      initialIgnoredIds.push(d.id);
    }
  }

  // 3. Deduplication (Deterministic)
  // Group by actor and pick most recent
  const decisionsByActor: Record<string, ApprovalDecision[]> = {};
  for (const d of relevantDecisions) {
    if (!decisionsByActor[d.actor.id]) {
      decisionsByActor[d.actor.id] = [];
    }
    decisionsByActor[d.actor.id].push(d);
  }

  const mostRecentDecisions: ApprovalDecision[] = [];
  const duplicateIgnoredIds: string[] = [];

  const actorIds = Object.keys(decisionsByActor).sort();

  for (const actorId of actorIds) {
    const actorDecisions = [...decisionsByActor[actorId]];
    // Sort: decidedAt DESC, then id DESC
    actorDecisions.sort((a, b) => {
      if (a.decidedAt !== b.decidedAt) {
        return b.decidedAt.localeCompare(a.decidedAt);
      }
      return b.id.localeCompare(a.id);
    });

    const mostRecent = actorDecisions[0];
    mostRecentDecisions.push(mostRecent);

    // All other decisions from this actor are ignored due to duplication
    for (let i = 1; i < actorDecisions.length; i++) {
      duplicateIgnoredIds.push(actorDecisions[i].id);
    }
  }

  // 4. Count Approvals
  const countedDecisionIds: string[] = [];
  const rejectedOrNoRoleIgnoredIds: string[] = [];
  const approverRoles = policy.requirement.approverRoles;

  // Track valid approvals per role for 'unanimous' mode
  const approvalsByRole: Record<string, Set<string>> = {};
  if (approverRoles) {
    for (const role of approverRoles) {
      approvalsByRole[role] = new Set();
    }
  }

  for (const d of mostRecentDecisions) {
    if (d.decision !== "approved") {
      rejectedOrNoRoleIgnoredIds.push(d.id);
      continue;
    }

    // Check roles if required
    if (approverRoles && approverRoles.length > 0) {
      const actorRoles = actorRolesByActorId[d.actor.id] || [];
      const matchingRoles = actorRoles.filter((r) => approverRoles.includes(r));

      if (matchingRoles.length === 0) {
        rejectedOrNoRoleIgnoredIds.push(d.id);
        continue;
      }

      // Actor has at least one required role
      countedDecisionIds.push(d.id);
      for (const role of matchingRoles) {
        approvalsByRole[role].add(d.actor.id);
      }
    } else {
      // No role requirement
      countedDecisionIds.push(d.id);
    }
  }

  const receivedApprovals = countedDecisionIds.length;
  let satisfied = false;
  const reasons: ApprovalPolicyEvaluationReason[] = [];

  const { mode, minimumApprovals } = policy.requirement;

  switch (mode) {
    case "none":
      satisfied = true;
      break;

    case "single":
      satisfied = receivedApprovals >= 1;
      if (!satisfied) {
        reasons.push({
          code: "INSUFFICIENT_APPROVALS",
          message: "At least one approval is required",
        });
      }
      break;

    case "quorum":
      const min = minimumApprovals || 0;
      satisfied = receivedApprovals >= min;
      if (!satisfied) {
        reasons.push({
          code: "INSUFFICIENT_APPROVALS",
          message: `Required ${min} approvals, but received ${receivedApprovals}`,
        });
      }
      break;

    case "unanimous":
      if (!approverRoles || approverRoles.length === 0) {
        // PR feedback: Unanimous mode without approverRoles is semantically undefined
        satisfied = false;
        reasons.push({
          code: "UNANIMOUS_ROLES_UNDEFINED",
          message: "Unanimous mode requires defined approver roles",
        });
      } else {
        const missingRoles = approverRoles.filter(
          (role) => (approvalsByRole[role]?.size ?? 0) === 0
        );
        satisfied = missingRoles.length === 0;
        if (!satisfied) {
          reasons.push({
            code: "MISSING_REQUIRED_ROLES",
            message: `Missing approvals from roles: ${missingRoles.join(", ")}`,
          });
        }
      }
      break;
  }

  // PR feedback: Result arrays must be fully deterministic.
  countedDecisionIds.sort();
  const ignoredDecisionIds = [
    ...initialIgnoredIds,
    ...duplicateIgnoredIds,
    ...rejectedOrNoRoleIgnoredIds,
  ].sort();
  reasons.sort((a, b) => a.code.localeCompare(b.code));

  return {
    satisfied,
    applicable: true,
    countedDecisionIds,
    ignoredDecisionIds,
    reasons,
    requiredApprovals: minimumApprovals,
    receivedApprovals,
  };
}
