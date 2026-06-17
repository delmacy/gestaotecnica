# Process Graph Validation (PKG-PROCESS-GRAPH-VALIDATION-001)

This document describes the semantic validation rules for process graphs within the Technical Management platform.

## Overview

Process graphs are defined by nodes and edges. While the structural integrity (ID uniqueness, valid types, required fields) is handled by Zod schemas, the semantic integrity is handled by the `validateProcessGraph` pure function.

## Validation Rules

### Global Rules

| Code | Severity | Description |
|------|----------|-------------|
| `NO_START_NODE` | Error | The process must have exactly one node of type `start`. |
| `MULTIPLE_START_NODES` | Error | The process cannot have more than one node of type `start`. |
| `NO_END_NODE` | Error | The process must have at least one node of type `end`. |

### Node Rules

| Code | Severity | Description |
|------|----------|-------------|
| `START_HAS_INCOMING_EDGE` | Error | A `start` node cannot have any incoming edges. |
| `END_HAS_OUTGOING_EDGE` | Error | An `end` node cannot have any outgoing edges. |
| `DEAD_END_NON_TERMINAL_NODE` | Error | Any node that is not an `end` node must have at least one outgoing edge. |

### Decision Rules

| Code | Severity | Description |
|------|----------|-------------|
| `DECISION_WITHOUT_BRANCHES` | Error | A `decision` node must have at least one outgoing edge. |
| `DUPLICATE_DECISION_PRIORITY` | Error | Outgoing edges from a `decision` node must have unique priorities. |

### Graph Traversal Rules

| Code | Severity | Description |
|------|----------|-------------|
| `UNREACHABLE_NODE` | Error | Every node in the graph must be reachable from the `start` node. |
| `CYCLE_DETECTED` | Warning | Detected a cycle in the graph. Cycles are permitted but flagged for visibility. |

## Report Structure

The validation report follows this structure:

```typescript
{
  valid: boolean; // true if no "error" severity issues are present
  issues: Array<{
    code: string;
    severity: "error" | "warning";
    message: string;
    nodeId?: string;
    edgeId?: string;
    path?: string[];
  }>;
}
```

## Issue Ordering

To ensure determinism, issues are sorted as follows:
1. Global issues (no `nodeId`).
2. Node-specific issues by `nodeId` (lexical).
3. Edge-specific issues by `edgeId` (lexical).
4. Issue `code` (lexical) as a tie-breaker.
