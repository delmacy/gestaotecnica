import { activeAdaptation } from "@/adaptations/active";

type DemandTypeKey = (typeof activeAdaptation.demandTypes)[number]["key"];

export const workItemTypes = activeAdaptation.demandTypes.map((item) => ({
  value: item.key,
  label: item.label,
  description: item.description,
  defaultQueue: item.defaultQueue,
  canGenerateServiceOrder: item.canGenerateServiceOrder,
  canAppearInShiftLog: item.canAppearInShiftLog,
})) satisfies Array<{
  value: DemandTypeKey;
  label: string;
  description: string;
  defaultQueue: string;
  canGenerateServiceOrder: boolean;
  canAppearInShiftLog: boolean;
}>;

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

export type WorkItemTypeValue = DemandTypeKey;
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
