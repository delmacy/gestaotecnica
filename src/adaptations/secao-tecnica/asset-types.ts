export const assetTypes = [
  {
    key: "equipment",
    label: "Equipamento",
    tracksMaintenance: true,
    tracksLocation: true,
  },
  {
    key: "infrastructure",
    label: "Infraestrutura",
    tracksMaintenance: true,
    tracksLocation: true,
  },
  {
    key: "digital_service",
    label: "Servico Digital",
    tracksMaintenance: true,
    tracksLocation: false,
  },
  {
    key: "tool",
    label: "Ferramenta/Instrumento",
    tracksMaintenance: true,
    tracksLocation: true,
  },
  {
    key: "documented_system",
    label: "Sistema Documentado",
    tracksMaintenance: false,
    tracksLocation: false,
  },
] as const;

export type AssetTypeKey = (typeof assetTypes)[number]["key"];
