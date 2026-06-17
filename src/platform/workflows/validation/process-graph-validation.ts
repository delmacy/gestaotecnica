import { z } from "zod";
import { ProcessVersion, ProcessNode, ProcessEdge } from "../contracts";

/**
 * Process Graph Issue Code
 */
export const ProcessGraphIssueCodeSchema = z.enum([
  "NO_START_NODE",
  "MULTIPLE_START_NODES",
  "NO_END_NODE",
  "UNREACHABLE_NODE",
  "START_HAS_INCOMING_EDGE",
  "END_HAS_OUTGOING_EDGE",
  "DEAD_END_NON_TERMINAL_NODE",
  "DECISION_WITHOUT_BRANCHES",
  "DUPLICATE_DECISION_PRIORITY",
  "CYCLE_DETECTED",
]);

export type ProcessGraphIssueCode = z.infer<typeof ProcessGraphIssueCodeSchema>;

/**
 * Process Graph Issue Severity
 */
export const ProcessGraphIssueSeveritySchema = z.enum(["error", "warning"]);

export type ProcessGraphIssueSeverity = z.infer<typeof ProcessGraphIssueSeveritySchema>;

/**
 * Process Graph Issue
 */
export const ProcessGraphIssueSchema = z
  .object({
    code: ProcessGraphIssueCodeSchema,
    severity: ProcessGraphIssueSeveritySchema,
    message: z.string(),
    nodeId: z.string().optional(),
    edgeId: z.string().optional(),
    path: z.array(z.string()).optional(),
  })
  .strict();

export type ProcessGraphIssue = z.infer<typeof ProcessGraphIssueSchema>;

/**
 * Process Graph Validation Report
 */
export const ProcessGraphValidationReportSchema = z
  .object({
    valid: z.boolean(),
    issues: z.array(ProcessGraphIssueSchema),
  })
  .strict();

export type ProcessGraphValidationReport = z.infer<typeof ProcessGraphValidationReportSchema>;

/**
 * Validates the semantic rules of a process graph.
 *
 * @param version The process version containing the graph definition.
 * @returns A structured validation report.
 */
export function validateProcessGraph(version: ProcessVersion): ProcessGraphValidationReport {
  const issues: ProcessGraphIssue[] = [];
  const nodes = version.definition.nodes;
  const edges = version.definition.edges;

  const startNodes = nodes.filter((n) => n.type === "start");
  const endNodes = nodes.filter((n) => n.type === "end");

  // 1. Global issues
  if (startNodes.length === 0) {
    issues.push({
      code: "NO_START_NODE",
      severity: "error",
      message: "Process must have exactly one start node.",
    });
  } else if (startNodes.length > 1) {
    issues.push({
      code: "MULTIPLE_START_NODES",
      severity: "error",
      message: `Process has ${startNodes.length} start nodes. Exactly one is required.`,
    });
  }

  if (endNodes.length === 0) {
    issues.push({
      code: "NO_END_NODE",
      severity: "error",
      message: "Process must have at least one end node.",
    });
  }

  // Maps for faster lookup
  const incomingEdgesMap = new Map<string, ProcessEdge[]>();
  const outgoingEdgesMap = new Map<string, ProcessEdge[]>();

  for (const edge of edges) {
    if (!outgoingEdgesMap.has(edge.sourceNodeId)) {
      outgoingEdgesMap.set(edge.sourceNodeId, []);
    }
    outgoingEdgesMap.get(edge.sourceNodeId)!.push(edge);

    if (!incomingEdgesMap.has(edge.targetNodeId)) {
      incomingEdgesMap.set(edge.targetNodeId, []);
    }
    incomingEdgesMap.get(edge.targetNodeId)!.push(edge);
  }

  // 2. Node-specific issues
  for (const node of nodes) {
    const incoming = incomingEdgesMap.get(node.id) || [];
    const outgoing = outgoingEdgesMap.get(node.id) || [];

    if (node.type === "start" && incoming.length > 0) {
      issues.push({
        code: "START_HAS_INCOMING_EDGE",
        severity: "error",
        message: "Start node cannot have incoming edges.",
        nodeId: node.id,
      });
    }

    if (node.type === "end" && outgoing.length > 0) {
      issues.push({
        code: "END_HAS_OUTGOING_EDGE",
        severity: "error",
        message: "End node cannot have outgoing edges.",
        nodeId: node.id,
      });
    }

    if (node.type !== "end" && outgoing.length === 0) {
      issues.push({
        code: "DEAD_END_NON_TERMINAL_NODE",
        severity: "error",
        message: "Non-terminal node must have at least one outgoing edge.",
        nodeId: node.id,
      });
    }

    // Decision specific rules
    if (node.type === "decision") {
      if (outgoing.length === 0) {
        issues.push({
          code: "DECISION_WITHOUT_BRANCHES",
          severity: "error",
          message: "Decision node must have at least one outgoing edge.",
          nodeId: node.id,
        });
      }

      const priorities = new Set<number>();
      for (const edge of outgoing) {
        if (priorities.has(edge.priority)) {
          issues.push({
            code: "DUPLICATE_DECISION_PRIORITY",
            severity: "error",
            message: `Decision node has duplicate edge priority: ${edge.priority}.`,
            nodeId: node.id,
            edgeId: edge.id,
          });
        }
        priorities.add(edge.priority);
      }
    }
  }

  // 3. Traversal rules (Reachability and Cycles)
  if (startNodes.length === 1) {
    const startNode = startNodes[0];
    const reachableNodes = new Set<string>();
    const visited = new Set<string>();

    // Cycle detection state
    const recursionStack = new Set<string>();
    let cycleDetected = false;

    // DFS for reachability and cycle detection
    const traverse = (nodeId: string) => {
      visited.add(nodeId);
      reachableNodes.add(nodeId);
      recursionStack.add(nodeId);

      const outgoing = outgoingEdgesMap.get(nodeId) || [];
      for (const edge of outgoing) {
        if (recursionStack.has(edge.targetNodeId)) {
          cycleDetected = true;
        }
        if (!visited.has(edge.targetNodeId)) {
          traverse(edge.targetNodeId);
        }
      }

      recursionStack.delete(nodeId);
    };

    traverse(startNode.id);

    // Unreachable nodes
    for (const node of nodes) {
      if (!reachableNodes.has(node.id)) {
        issues.push({
          code: "UNREACHABLE_NODE",
          severity: "error",
          message: "Node is not reachable from the start node.",
          nodeId: node.id,
        });
      }
    }

    if (cycleDetected) {
      issues.push({
        code: "CYCLE_DETECTED",
        severity: "warning",
        message: "Cycle detected in the process graph.",
      });
    }
  }

  // Final sorting: Global, nodeId, edgeId, code (lexical)
  const sortedIssues = [...issues].sort((a, b) => {
    // 1. Issues without nodeId first (global)
    if (a.nodeId && !b.nodeId) return 1;
    if (!a.nodeId && b.nodeId) return -1;

    // 2. nodeId lexical
    if (a.nodeId && b.nodeId && a.nodeId !== b.nodeId) {
      return a.nodeId.localeCompare(b.nodeId);
    }

    // 3. edgeId lexical
    if (a.edgeId && !b.edgeId) return 1;
    if (!a.edgeId && b.edgeId) return -1;
    if (a.edgeId && b.edgeId && a.edgeId !== b.edgeId) {
      return a.edgeId.localeCompare(b.edgeId);
    }

    // 4. code lexical
    return a.code.localeCompare(b.code);
  });

  return {
    valid: !sortedIssues.some((i) => i.severity === "error"),
    issues: sortedIssues,
  };
}

/**
 * Helper to check if a process graph is valid.
 *
 * @param version The process version containing the graph definition.
 * @returns True if the graph has no errors.
 */
export function isProcessGraphValid(version: ProcessVersion): boolean {
  const report = validateProcessGraph(version);
  return report.valid;
}
