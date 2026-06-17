import { ProcessDefinitionEnvelope } from "../contracts/process-definition";
import { validateProcessGraph } from "../validation/process-graph-validation";
import {
  ApprovalPolicy,
  ApprovalDecision,
  evaluateApprovalPolicy,
} from "../../governance";

export interface ProcessPublicationEligibilityReason {
  code: string;
  message: string;
  source: "graph" | "approval" | "version";
  nodeId?: string;
  edgeId?: string;
}

export interface ProcessPublicationEligibilityResult {
  eligible: boolean;
  graphValid: boolean;
  approvalApplicable: boolean;
  approvalSatisfied: boolean;
  reasons: ProcessPublicationEligibilityReason[];
  countedDecisionIds: string[];
  ignoredDecisionIds: string[];
}

export interface EvaluateProcessPublicationEligibilityOptions {
  envelope: ProcessDefinitionEnvelope;
  policy?: ApprovalPolicy;
  decisions?: ApprovalDecision[];
  actorRolesByActorId?: Record<string, string[]>;
}

/**
 * Pure service to determine if a process version is eligible for publication.
 * PKG-PROCESS-PUBLICATION-ELIGIBILITY-001
 */
export function evaluateProcessPublicationEligibility(
  options: EvaluateProcessPublicationEligibilityOptions
): ProcessPublicationEligibilityResult {
  const { envelope, policy, decisions = [], actorRolesByActorId = {} } = options;
  const { version } = envelope;

  const reasons: ProcessPublicationEligibilityReason[] = [];

  // 1. Version Status Check
  // Publication is only eligible when status is 'draft' (as per standard lifecycle)
  if (version.status !== "draft") {
    reasons.push({
      code: "VERSION_STATUS_NOT_PUBLISHABLE",
      message: `Version status is '${version.status}', but only 'draft' versions can be published.`,
      source: "version",
    });
  }

  // 2. Semantic Graph Validation
  const graphReport = validateProcessGraph(version);
  const graphValid = graphReport.valid;

  for (const issue of graphReport.issues) {
    if (issue.severity === "error") {
      reasons.push({
        code: issue.code,
        message: issue.message,
        source: "graph",
        nodeId: issue.nodeId,
        edgeId: issue.edgeId,
      });
    }
  }

  // 3. Approval Policy Evaluation
  let approvalSatisfied = true;
  let approvalApplicable = false;
  let countedDecisionIds: string[] = [];
  let ignoredDecisionIds: string[] = decisions.map((d) => d.id).sort();

  if (policy) {
    const evaluation = evaluateApprovalPolicy({
      policy,
      decisions,
      subject: {
        type: "process_version",
        id: version.id, // Or version.processDefinitionId? Task says id=versão/processo conforme contrato real.
        // Usually subject.id refers to the asset being governed.
        version: version.version,
      },
      operation: "publish",
      workspaceId: version.workspaceId,
      actorRolesByActorId,
    });

    approvalApplicable = evaluation.applicable;
    if (approvalApplicable) {
      approvalSatisfied = evaluation.satisfied;
      countedDecisionIds = evaluation.countedDecisionIds;
      ignoredDecisionIds = evaluation.ignoredDecisionIds;

      for (const reason of evaluation.reasons) {
        reasons.push({
          code: reason.code,
          message: reason.message,
          source: "approval",
        });
      }
    } else {
      // Policy provided but not applicable: do not block publication
      approvalSatisfied = true;
      countedDecisionIds = [];
      ignoredDecisionIds = decisions.map((d) => d.id).sort();
    }
  } else {
    // No policy provided: eligible without approval
    approvalSatisfied = true;
    countedDecisionIds = [];
    ignoredDecisionIds = decisions.map((d) => d.id).sort();
    approvalApplicable = false;
  }

  // Final Eligibility
  const eligible = version.status === "draft" && graphValid && approvalSatisfied;

  // 4. Determinism: reasons ordered by source, code, nodeId, edgeId
  reasons.sort((a, b) => {
    if (a.source !== b.source) return a.source.localeCompare(b.source);
    if (a.code !== b.code) return a.code.localeCompare(b.code);
    if (a.nodeId !== b.nodeId) {
      if (!a.nodeId) return -1;
      if (!b.nodeId) return 1;
      return a.nodeId.localeCompare(b.nodeId);
    }
    if (a.edgeId !== b.edgeId) {
      if (!a.edgeId) return -1;
      if (!b.edgeId) return 1;
      return a.edgeId.localeCompare(b.edgeId);
    }
    return 0;
  });

  return {
    eligible,
    graphValid,
    approvalApplicable,
    approvalSatisfied,
    reasons,
    countedDecisionIds,
    ignoredDecisionIds,
  };
}
