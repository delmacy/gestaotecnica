export const automationStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativa" },
  { value: "paused", label: "Pausada" },
  { value: "failed", label: "Falha" },
  { value: "retired", label: "Encerrada" },
] as const;

export type AutomationStatusValue = (typeof automationStatuses)[number]["value"];

export function getAutomationStatusLabel(value: string) {
  return automationStatuses.find((item) => item.value === value)?.label ?? value;
}
