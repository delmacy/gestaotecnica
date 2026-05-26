export const shiftStatuses = [
  { value: "open", label: "Aberto" },
  { value: "review", label: "Em revisao" },
  { value: "closed", label: "Fechado" },
] as const;

export type ShiftStatusValue = (typeof shiftStatuses)[number]["value"];

export function getShiftStatusLabel(value: string) {
  return shiftStatuses.find((item) => item.value === value)?.label ?? value;
}
