import { activeAdaptation } from "@/adaptations/active";

type LegacyTechnicianLevel = "trainee" | "pleno" | "especialista" | "supervisor";

export const technicianLevels = activeAdaptation.businessRoles.flatMap((role) =>
  "legacyLevel" in role
    ? [
        {
          value: role.legacyLevel,
          label: role.label,
          roleKey: role.key,
        },
      ]
    : [],
) satisfies Array<{
  value: LegacyTechnicianLevel;
  label: string;
  roleKey: string;
}>;

export type TechnicianLevelValue = LegacyTechnicianLevel;

export const workforceAllocationTypes = [
  { value: "service_order", label: "Execucao" },
  { value: "work_item", label: "Demanda" },
  { value: "schedule", label: "Escala" },
  { value: "training", label: "Treinamento" },
  { value: "administrative", label: "Administrativo" },
] as const;

export const workforceAllocationStatuses = [
  { value: "planned", label: "Planejada" },
  { value: "active", label: "Ativa" },
  { value: "completed", label: "Concluida" },
  { value: "cancelled", label: "Cancelada" },
] as const;

export type WorkforceAllocationTypeValue = (typeof workforceAllocationTypes)[number]["value"];
export type WorkforceAllocationStatusValue = (typeof workforceAllocationStatuses)[number]["value"];

export function getTechnicianLevelLabel(value: string) {
  return technicianLevels.find((item) => item.value === value)?.label ?? value;
}

export function getWorkforceAllocationTypeLabel(value: string) {
  return workforceAllocationTypes.find((item) => item.value === value)?.label ?? value;
}

export function getWorkforceAllocationStatusLabel(value: string) {
  return workforceAllocationStatuses.find((item) => item.value === value)?.label ?? value;
}
