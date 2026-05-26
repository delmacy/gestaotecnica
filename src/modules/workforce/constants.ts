export const technicianLevels = [
  { value: "trainee", label: "Trainee" },
  { value: "pleno", label: "Pleno" },
  { value: "especialista", label: "Especialista" },
  { value: "supervisor", label: "Supervisor" },
] as const;

export type TechnicianLevelValue = (typeof technicianLevels)[number]["value"];

export function getTechnicianLevelLabel(value: string) {
  return technicianLevels.find((item) => item.value === value)?.label ?? value;
}
