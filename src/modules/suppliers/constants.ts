export const supplierStatuses = [
  { value: "prospect", label: "Prospect" },
  { value: "active", label: "Ativo" },
  { value: "under_review", label: "Em revisao" },
  { value: "suspended", label: "Suspenso" },
  { value: "inactive", label: "Inativo" },
] as const;

export const contractStatuses = [
  { value: "draft", label: "Rascunho" },
  { value: "active", label: "Ativo" },
  { value: "expiring", label: "A vencer" },
  { value: "expired", label: "Vencido" },
  { value: "cancelled", label: "Cancelado" },
] as const;

export type SupplierStatusValue = (typeof supplierStatuses)[number]["value"];
export type ContractStatusValue = (typeof contractStatuses)[number]["value"];

export function getSupplierStatusLabel(value: string) {
  return supplierStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getContractStatusLabel(value: string) {
  return contractStatuses.find((item) => item.value === value)?.label ?? value;
}
