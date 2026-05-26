export const skillProficiencies = [
  { value: "basic", label: "Basico" },
  { value: "intermediate", label: "Intermediario" },
  { value: "advanced", label: "Avancado" },
  { value: "expert", label: "Especialista" },
] as const;

export const trainingStatuses = [
  { value: "planned", label: "Planejado" },
  { value: "in_progress", label: "Em andamento" },
  { value: "completed", label: "Concluido" },
  { value: "expired", label: "Vencido" },
  { value: "cancelled", label: "Cancelado" },
] as const;

export type SkillProficiencyValue = (typeof skillProficiencies)[number]["value"];
export type TrainingStatusValue = (typeof trainingStatuses)[number]["value"];

export function getSkillProficiencyLabel(value: string) {
  return skillProficiencies.find((item) => item.value === value)?.label ?? value;
}

export function getTrainingStatusLabel(value: string) {
  return trainingStatuses.find((item) => item.value === value)?.label ?? value;
}
