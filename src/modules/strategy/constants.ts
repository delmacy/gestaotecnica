export const planningStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "proposed", label: "Proposto" },
  { value: "approved", label: "Aprovado" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluido" },
  { value: "cancelled", label: "Cancelado" },
] as const;

export const acquisitionStatuses = [
  { value: "identified", label: "Identificada" },
  { value: "justified", label: "Justificada" },
  { value: "requested", label: "Solicitada" },
  { value: "approved", label: "Aprovada" },
  { value: "ordered", label: "Comprada" },
  { value: "received", label: "Recebida" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export type PlanningStatusValue = (typeof planningStatuses)[number]["value"];
export type AcquisitionStatusValue = (typeof acquisitionStatuses)[number]["value"];
export type PriorityValue = (typeof priorities)[number]["value"];

export function getPlanningStatusLabel(value: string) {
  return planningStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getAcquisitionStatusLabel(value: string) {
  return acquisitionStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getPriorityLabel(value: string) {
  return priorities.find((item) => item.value === value)?.label ?? value;
}
