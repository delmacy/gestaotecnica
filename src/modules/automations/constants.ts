export const automationStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativa" },
  { value: "paused", label: "Pausada" },
  { value: "failed", label: "Falha" },
  { value: "retired", label: "Encerrada" },
] as const;

export type AutomationStatusValue = (typeof automationStatuses)[number]["value"];

export const automationRunStatuses = [
  { value: "queued", label: "Na fila" },
  { value: "running", label: "Executando" },
  { value: "succeeded", label: "Sucesso" },
  { value: "failed", label: "Falha" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export type AutomationRunStatusValue = (typeof automationRunStatuses)[number]["value"];

export function getAutomationStatusLabel(value: string) {
  return automationStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getAutomationRunStatusLabel(value: string) {
  return automationRunStatuses.find((item) => item.value === value)?.label ?? value;
}
