import type { BuilderDraft } from "@/features/builder/types";
import type { CreateProcessDefinitionInput } from "./process-definition.types";
import { createProcessKeyFromName } from "./process-definition.mapper";

export function createSampleBuilderDraft(): BuilderDraft {
  const startId = "node-start";
  const humanTaskId = "node-human-task";
  const endId = "node-end";

  return {
    name: "Draft de Teste",
    description: "Um processo simples para testar a persistência.",
    status: "draft",
    version: 1,
    nodes: [
      {
        id: startId,
        type: "start",
        label: "Início",
        position: { x: 100, y: 100 },
        config: {},
      },
      {
        id: humanTaskId,
        type: "human_task",
        label: "Aprovação Manual",
        description: "Revisar dados",
        position: { x: 300, y: 100 },
        config: {},
      },
      {
        id: endId,
        type: "end",
        label: "Fim",
        position: { x: 500, y: 100 },
        config: {},
      }
    ],
    edges: [
      {
        id: "edge-1",
        source: startId,
        target: humanTaskId,
      },
      {
        id: "edge-2",
        source: humanTaskId,
        target: endId,
      }
    ],
  };
}

export function createSampleCreateProcessDefinitionInput(workspaceId: string): CreateProcessDefinitionInput {
  const draft = createSampleBuilderDraft();
  const name = draft.name || "Processo de Exemplo";

  return {
    workspaceId,
    key: createProcessKeyFromName(name),
    name,
    description: draft.description,
    draft,
    createdBy: "system",
  };
}
