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

export type ServiceOrderStatusValue = (typeof serviceOrderStatuses)[number]["value"];

export function getServiceOrderStatusLabel(value: string) {
  return serviceOrderStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getServiceOrderPriorityLabel(value: string) {
  return serviceOrderPriorities.find((item) => item.value === value)?.label ?? value;
}
