export const legacySyncStatuses = [
  { value: "pending", label: "Pendente" },
  { value: "prepared", label: "Preparado" },
  { value: "exported", label: "Exportado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "failed", label: "Falhou" },
] as const;

export type LegacySyncStatusValue = (typeof legacySyncStatuses)[number]["value"];

export function getLegacySyncStatusLabel(value: string) {
  return legacySyncStatuses.find((item) => item.value === value)?.label ?? value;
}
