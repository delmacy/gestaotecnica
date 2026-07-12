import { BuilderDraftValidationSchema } from "./builder-draft.schema";
import { getAction } from "@/platform/actions/action-registry";
import type { BuilderDraft, BuilderValidationResult, BuilderValidationIssue } from "../types";

export function validateBuilderDraft(draft: BuilderDraft): BuilderValidationResult {
  const issues: BuilderValidationIssue[] = [];

  const zodResult = BuilderDraftValidationSchema.safeParse(draft);
  if (!zodResult.success) {
    for (const error of zodResult.error.issues) {
      issues.push({
        code: "ZOD_VALIDATION_ERROR",
        message: error.message,
        severity: "error",
        path: error.path.join("."),
      });
    }
  }


  if (!draft.name || draft.name.trim() === "") {
    issues.push({
      code: "DRAFT_NAME_REQUIRED",
      message: "O nome do processo é obrigatório.",
      severity: "error",
      path: "name",
    });
  }

  if (draft.nodes.length === 0) {
    issues.push({
      code: "EMPTY_DRAFT",
      message: "O processo está vazio.",
      severity: "warning",
    });
  }

  const nodeIds = new Set<string>();
  let startNodeCount = 0;
  let endNodeCount = 0;

  for (const node of draft.nodes) {
    if (nodeIds.has(node.id)) {
      issues.push({
        code: "DUPLICATE_NODE_ID",
        message: `ID de nó duplicado encontrado: ${node.id}`,
        severity: "error",
        path: `nodes[id=${node.id}]`,
      });
    }
    nodeIds.add(node.id);

    if (node.type === "integration") {
      const actionName = node.config?.action;
      if (!actionName || typeof actionName !== "string") {
        issues.push({
          code: "MISSING_ACTION_REFERENCE",
          message: `Nó de integração sem ação configurada: ${node.id}`,
          severity: "error",
          path: `nodes[id=${node.id}].config.action`,
        });
      } else {
        const actionDef = getAction(actionName);
        if (!actionDef) {
          issues.push({
            code: "INVALID_ACTION_REFERENCE",
            message: `Ação referenciada não existe: ${actionName}`,
            severity: "error",
            path: `nodes[id=${node.id}].config.action`,
          });
        }
      }
    }


    if (node.type === "start") {
      startNodeCount++;
    } else if (node.type === "end") {
      endNodeCount++;
    }
  }

  if (startNodeCount > 1) {
    issues.push({
      code: "MULTIPLE_START_NODES",
      message: "Deve haver no máximo um nó do tipo 'start'.",
      severity: "error",
    });
  }

  if (endNodeCount > 1) {
    issues.push({
      code: "MULTIPLE_END_NODES",
      message: "Deve haver no máximo um nó do tipo 'end'.",
      severity: "error",
    });
  }

  const edgeIds = new Set<string>();
  for (const edge of draft.edges) {
    if (edgeIds.has(edge.id)) {
      issues.push({
        code: "DUPLICATE_EDGE_ID",
        message: `ID de conexão duplicado encontrado: ${edge.id}`,
        severity: "error",
        path: `edges[id=${edge.id}]`,
      });
    }
    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.source)) {
      issues.push({
        code: "EDGE_SOURCE_NOT_FOUND",
        message: `Conexão aponta para nó de origem inexistente: ${edge.source}`,
        severity: "error",
        path: `edges[id=${edge.id}].source`,
      });
    }

    if (!nodeIds.has(edge.target)) {
      issues.push({
        code: "EDGE_TARGET_NOT_FOUND",
        message: `Conexão aponta para nó de destino inexistente: ${edge.target}`,
        severity: "error",
        path: `edges[id=${edge.id}].target`,
      });
    }
  }

  const hasErrors = issues.some((issue) => issue.severity === "error");

  return {
    valid: !hasErrors,
    issues,
  };
}
