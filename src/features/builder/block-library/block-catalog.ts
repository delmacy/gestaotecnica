import type { BuilderBlockDefinition, BuilderBlockType } from "../types";

export const BUILDER_BLOCK_CATALOG: BuilderBlockDefinition[] = [
  {
    type: "start",
    category: "flow",
    label: "Início",
    description: "Ponto de partida do processo.",
    defaultConfig: {},
    inputs: [],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "human_task",
    category: "human",
    label: "Tarefa humana",
    description: "Etapa executada por uma pessoa dentro do processo.",
    defaultConfig: {
      assigneeMode: "manual",
      instructions: "",
      allowComments: true,
      requireManualCompletion: true,
    },
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "form",
    category: "human",
    label: "Formulário",
    description: "Coleta de dados através de um formulário estruturado.",
    defaultConfig: {
      formId: "",
    },
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "decision",
    category: "flow",
    label: "Decisão",
    description: "Bifurcação condicional do processo.",
    defaultConfig: {
      conditionType: "expression",
    },
    inputs: [{ id: "input", label: "Entrada" }],
    outputs: [
      { id: "true", label: "Verdadeiro" },
      { id: "false", label: "Falso" },
    ],
  },
  {
    type: "approval",
    category: "human",
    label: "Aprovação",
    description: "Etapa de revisão e aprovação por um responsável.",
    defaultConfig: {
      requireSignature: false,
    },
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "document",
    category: "document",
    label: "Documento",
    description: "Geração ou manipulação de um documento.",
    defaultConfig: {
      templateId: "",
    },
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "notification",
    category: "automation",
    label: "Notificação",
    description: "Envio de notificação ou alerta.",
    defaultConfig: {
      channel: "system",
      messageTemplate: "",
    },
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "integration",
    category: "integration",
    label: "Integração",
    description: "Comunicação com um sistema externo ou API.",
    defaultConfig: {
      integrationId: "",
      action: "",
    },
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [{ id: "next", label: "Próximo" }],
  },
  {
    type: "end",
    category: "flow",
    label: "Fim",
    description: "Encerramento do fluxo ou caminho.",
    defaultConfig: {},
    inputs: [{ id: "previous", label: "Entrada" }],
    outputs: [],
  },
];

export function getBuilderBlockDefinition(
  type: BuilderBlockType,
): BuilderBlockDefinition | undefined {
  return BUILDER_BLOCK_CATALOG.find((block) => block.type === type);
}

export function listBuilderBlockDefinitions(): BuilderBlockDefinition[] {
  return BUILDER_BLOCK_CATALOG;
}
