import { activeAdaptation } from "@/adaptations/active";

export const ASSET_STATUSES = [
  { value: "available", label: "Disponível" },
  { value: "in_use", label: "Em Uso" },
  { value: "maintenance", label: "Em Manutenção" },
  { value: "broken", label: "Avariado" },
  { value: "retired", label: "Desativado" },
] as const;

export type AssetStatus = (typeof ASSET_STATUSES)[number]["value"];

export const ASSET_CATEGORIES = [
  { value: "equipment", label: "Equipamento" },
  { value: "vehicle", label: "Veículo" },
  { value: "tool", label: "Ferramenta" },
  { value: "furniture", label: "Mobiliário" },
  { value: "it_asset", label: "Ativo de TI" },
  { value: "other", label: "Outro" },
] as const;

export type AssetCategory = (typeof ASSET_CATEGORIES)[number]["value"];

export function getStatusLabel(status: string) {
  return ASSET_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getCategoryLabel(category: string) {
  return ASSET_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

// Aliases for backward compatibility
export const assetStatuses = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "maintenance", label: "Em manutenção" },
  { value: "decommissioned", label: "Desativado" },
] as const;

export const assetCriticalities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
] as const;

export const assetTypeSuggestions = activeAdaptation.assetTypes.map((type) => ({
  value: type.key,
  label: type.label,
}));

export type AssetStatusValue = (typeof assetStatuses)[number]["value"];
export type AssetCriticalityValue = (typeof assetCriticalities)[number]["value"];

export const getAssetStatusLabel = getStatusLabel;
export const getAssetTypeLabel = getCategoryLabel;
export function getAssetCriticalityLabel(value: string) {
  return assetCriticalities.find((item) => item.value === value)?.label ?? value;
}
