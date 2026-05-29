import { activeAdaptation } from "@/adaptations/active";

type ShiftTypeKey = (typeof activeAdaptation.shiftTypes)[number]["key"];

export const scheduleTypes = activeAdaptation.shiftTypes.map((item) => ({
  value: item.key,
  label: item.label,
  description: item.description,
  requiresShiftLog: item.requiresShiftLog,
  allowsOverlap: item.allowsOverlap,
})) satisfies Array<{
  value: ShiftTypeKey;
  label: string;
  description: string;
  requiresShiftLog: boolean;
  allowsOverlap: boolean;
}>;

export const scheduleStatuses = [
  { value: "planned", label: "Planejada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Concluida" },
] as const;

export type ScheduleTypeValue = ShiftTypeKey;
export type ScheduleStatusValue = (typeof scheduleStatuses)[number]["value"];

export function getScheduleTypeLabel(value: string) {
  return scheduleTypes.find((item) => item.value === value)?.label ?? value;
}

export function getScheduleStatusLabel(value: string) {
  return scheduleStatuses.find((item) => item.value === value)?.label ?? value;
}
