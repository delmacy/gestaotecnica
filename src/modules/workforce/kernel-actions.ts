import { getDb } from "@/db";
import { technicianProfiles, teams } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  enumProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";
import { technicianLevels } from "./constants";

type CreateTechnicianInput = {
  userId?: string;
  teamId?: string;
  level?: string;
  registrationCode?: string;
  specialty?: string;
};

function pickAllowed<T extends string>(
  value: string | undefined,
  allowedValues: readonly { value: T }[],
  fallback: T,
) {
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export const createTechnicianKernelAction: ActionDefinition<
  CreateTechnicianInput,
  { id: string; userId: string; level: string }
> = {
  key: "workforce.create_technician",
  moduleKey: "workforce",
  description: "Cria um perfil de técnico para um usuário.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      userId: uuidProperty("Usuário que receberá o perfil técnico."),
      teamId: uuidProperty("Equipe inicial."),
      level: enumProperty(technicianLevels.map((l) => l.value), "Nível técnico."),
      registrationCode: stringProperty("Matrícula ou código funcional."),
      specialty: stringProperty("Especialidade principal."),
    },
    ["userId"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do perfil técnico."),
    userId: uuidProperty("Usuário relacionado."),
    level: stringProperty("Nível atribuído."),
  }),
  emits: ["workforce.technician_created"],
  async handler(input) {
    const userId = String(input.userId ?? "").trim();
    if (!userId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "userId é obrigatório." },
      };
    }

    const level = pickAllowed(input.level, technicianLevels, "trainee");
    const db = getDb();
    const [profile] = await db
      .insert(technicianProfiles)
      .values({
        userId,
        teamId: input.teamId,
        level,
        registrationCode: input.registrationCode,
        specialty: input.specialty,
        isAvailable: true,
      })
      .returning({
        id: technicianProfiles.id,
        userId: technicianProfiles.userId,
        level: technicianProfiles.level,
      });

    return {
      success: true,
      data: profile,
      events: [
        {
          eventType: "workforce.technician_created",
          entityType: "technician_profile",
          entityId: profile.id,
          payload: { userId: profile.userId, level: profile.level },
        },
      ],
    };
  },
};

type CreateTeamInput = {
  name?: string;
  description?: string;
};

export const createTeamKernelAction: ActionDefinition<
  CreateTeamInput,
  { id: string; name: string }
> = {
  key: "workforce.create_team",
  moduleKey: "workforce",
  description: "Cria uma equipe técnica.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      name: stringProperty("Nome da equipe."),
      description: stringProperty("Descrição da equipe."),
    },
    ["name"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da equipe."),
    name: stringProperty("Nome da equipe."),
  }),
  emits: ["workforce.team_created"],
  async handler(input) {
    const name = String(input.name ?? "").trim();
    if (!name) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "name é obrigatório." },
      };
    }

    const db = getDb();
    const [team] = await db
      .insert(teams)
      .values({
        name,
        description: input.description,
        isActive: true,
      })
      .returning({
        id: teams.id,
        name: teams.name,
      });

    return {
      success: true,
      data: team,
      events: [
        {
          eventType: "workforce.team_created",
          entityType: "team",
          entityId: team.id,
          payload: { name: team.name },
        },
      ],
    };
  },
};
