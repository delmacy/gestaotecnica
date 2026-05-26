export const scheduleTypes = [
  { value: "expediente", label: "Expediente" },
  { value: "plantao", label: "Plantao" },
  { value: "sobreaviso", label: "Sobreaviso" },
  { value: "ausencia", label: "Ausencia" },
] as const;

export const scheduleStatuses = [
  { value: "planned", label: "Planejada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Concluida" },
] as const;

export type ScheduleTypeValue = (typeof scheduleTypes)[number]["value"];
export type ScheduleStatusValue = (typeof scheduleStatuses)[number]["value"];

export function getScheduleTypeLabel(value: string) {
  return scheduleTypes.find((item) => item.value === value)?.label ?? value;
}

export function getScheduleStatusLabel(value: string) {
  return scheduleStatuses.find((item) => item.value === value)?.label ?? value;
}
