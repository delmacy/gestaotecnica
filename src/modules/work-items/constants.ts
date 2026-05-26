export const workItemTypes = [
  { value: "incidente", label: "Incidente" },
  { value: "solicitacao", label: "Solicitacao" },
  { value: "vistoria", label: "Vistoria" },
  { value: "manutencao", label: "Manutencao" },
  { value: "pendencia_turno", label: "Pendencia de turno" },
  { value: "atividade_planejada", label: "Atividade planejada" },
  { value: "administrativo", label: "Administrativo" },
] as const;

export const workItemPriorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export const workItemStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "open", label: "Aberta" },
  { value: "triaged", label: "Triada" },
  { value: "planned", label: "Planejada" },
  { value: "in_progress", label: "Em execucao" },
  { value: "blocked", label: "Bloqueada" },
  { value: "resolved", label: "Resolvida" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export type WorkItemTypeValue = (typeof workItemTypes)[number]["value"];
export type WorkItemPriorityValue = (typeof workItemPriorities)[number]["value"];
export type WorkItemStatusValue = (typeof workItemStatuses)[number]["value"];

export function getWorkItemTypeLabel(value: string) {
  return workItemTypes.find((item) => item.value === value)?.label ?? value;
}

export function getWorkItemPriorityLabel(value: string) {
  return workItemPriorities.find((item) => item.value === value)?.label ?? value;
}

export function getWorkItemStatusLabel(value: string) {
  return workItemStatuses.find((item) => item.value === value)?.label ?? value;
}
