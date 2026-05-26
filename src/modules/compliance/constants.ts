export const auditStatuses = [
  { value: "planned", label: "Planejada" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluida" },
  { value: "requires_action", label: "Requer acao" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export const findingSeverities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export const findingStatuses = [
  { value: "open", label: "Aberto" },
  { value: "in_progress", label: "Em andamento" },
  { value: "mitigated", label: "Mitigado" },
  { value: "accepted", label: "Aceito" },
  { value: "closed", label: "Fechado" },
] as const;

export const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export type AuditStatusValue = (typeof auditStatuses)[number]["value"];
export type FindingSeverityValue = (typeof findingSeverities)[number]["value"];
export type FindingStatusValue = (typeof findingStatuses)[number]["value"];
export type PriorityValue = (typeof priorities)[number]["value"];

export function getAuditStatusLabel(value: string) {
  return auditStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getFindingSeverityLabel(value: string) {
  return findingSeverities.find((item) => item.value === value)?.label ?? value;
}

export function getFindingStatusLabel(value: string) {
  return findingStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getPriorityLabel(value: string) {
  return priorities.find((item) => item.value === value)?.label ?? value;
}
