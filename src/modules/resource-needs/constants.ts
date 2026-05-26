export const resourceNeedStatuses = [
  { value: "identified", label: "Identificada" },
  { value: "prioritized", label: "Priorizada" },
  { value: "approved", label: "Aprovada" },
  { value: "in_progress", label: "Em andamento" },
  { value: "fulfilled", label: "Atendida" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export type ResourceNeedStatusValue = (typeof resourceNeedStatuses)[number]["value"];
export type PriorityValue = (typeof priorities)[number]["value"];

export function getResourceNeedStatusLabel(value: string) {
  return resourceNeedStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getPriorityLabel(value: string) {
  return priorities.find((item) => item.value === value)?.label ?? value;
}
