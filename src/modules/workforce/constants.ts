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

export function getTechnicianLevelLabel(value: string) {
  return technicianLevels.find((item) => item.value === value)?.label ?? value;
}
