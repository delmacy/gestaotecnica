export const inventoryItemStatuses = [
  { value: "available", label: "Disponivel" },
  { value: "reserved", label: "Reservado" },
  { value: "low_stock", label: "Estoque baixo" },
  { value: "unavailable", label: "Indisponivel" },
  { value: "retired", label: "Retirado" },
] as const;

export const inventoryMovementTypes = [
  { value: "inbound", label: "Entrada" },
  { value: "outbound", label: "Saida" },
  { value: "reservation", label: "Reserva" },
  { value: "release", label: "Liberacao" },
  { value: "adjustment", label: "Ajuste" },
] as const;

export type InventoryItemStatusValue = (typeof inventoryItemStatuses)[number]["value"];
export type InventoryMovementTypeValue = (typeof inventoryMovementTypes)[number]["value"];

export function getInventoryStatusLabel(value: string) {
  return inventoryItemStatuses.find((item) => item.value === value)?.label ?? value;
}

export function getMovementTypeLabel(value: string) {
  return inventoryMovementTypes.find((item) => item.value === value)?.label ?? value;
}
