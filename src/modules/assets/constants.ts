export const assetStatuses = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "maintenance", label: "Em manutencao" },
  { value: "decommissioned", label: "Desativado" },
] as const;

export const assetCriticalities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Critica" },
] as const;

export const assetTypeSuggestions = [
  "equipamento",
  "sistema",
  "infraestrutura",
  "rede",
  "software",
  "documento",
] as const;

export type AssetStatusValue = (typeof assetStatuses)[number]["value"];
export type AssetCriticalityValue = (typeof assetCriticalities)[number]["value"];

export function getAssetStatusLabel(value: string) {
  return assetStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getAssetCriticalityLabel(value: string) {
  return assetCriticalities.find((item) => item.value === value)?.label ?? value;
}
