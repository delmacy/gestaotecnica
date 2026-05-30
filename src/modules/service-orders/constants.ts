import { activeAdaptation } from "@/adaptations/active";

export const serviceOrderStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "open", label: "Aberta" },
  { value: "assigned", label: "Atribuida" },
  { value: "in_progress", label: "Em execucao" },
  { value: "waiting_review", label: "Aguardando revisao" },
  { value: "completed", label: "Concluida" },
  { value: "approved", label: "Aprovada" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export const serviceOrderPriorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export const serviceOrderStageStatuses = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em execucao" },
  { value: "blocked", label: "Bloqueada" },
  { value: "completed", label: "Concluida" },
] as const;

export const serviceOrderTaskStatuses = [
  { value: "open", label: "Aberta" },
  { value: "in_progress", label: "Em execucao" },
  { value: "blocked", label: "Bloqueada" },
  { value: "done", label: "Feita" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export const serviceOrderTargetTypes = [
  { value: "asset", label: "Ativo" },
  { value: "work_item", label: "Demanda" },
  { value: "location", label: "Local" },
  { value: "system", label: "Sistema" },
  { value: "other", label: "Outro" },
] as const;

export const serviceOrderTypes = activeAdaptation.serviceOrderTypes.map((type: any) => ({
  value: type.key,
  label: type.label,
}));

export type ServiceOrderStatusValue = (typeof serviceOrderStatuses)[number]["value"];
export type ServiceOrderTypeValue = (typeof serviceOrderTypes)[number]["value"];
export type ServiceOrderStageStatusValue = (typeof serviceOrderStageStatuses)[number]["value"];
export type ServiceOrderTaskStatusValue = (typeof serviceOrderTaskStatuses)[number]["value"];
export type ServiceOrderTargetTypeValue = (typeof serviceOrderTargetTypes)[number]["value"];

export function getServiceOrderStatusLabel(value: string) {
  return serviceOrderStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getServiceOrderTypeLabel(value: string) {
  return serviceOrderTypes.find((item) => item.value === value)?.label ?? value;
}

export function getServiceOrderPriorityLabel(value: string) {
  return serviceOrderPriorities.find((item) => item.value === value)?.label ?? value;
}

export function getServiceOrderStageStatusLabel(value: string) {
  return serviceOrderStageStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getServiceOrderTaskStatusLabel(value: string) {
  return serviceOrderTaskStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getServiceOrderTargetTypeLabel(value: string) {
  return serviceOrderTargetTypes.find((item) => item.value === value)?.label ?? value;
}
