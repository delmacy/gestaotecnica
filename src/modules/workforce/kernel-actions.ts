import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import {
  teams,
  technicianProfiles,
} from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  enumProperty,
} from "@/platform/actions/schema-presets";
import {
  CreateWorkforceMemberInputSchema,
  CreateUnavailabilityInputSchema
} from "./contracts/workforce.schema";

const WORKFORCE_MEMBER_ORIGIN = "workforce.member";
const WORKFORCE_UNAVAILABILITY_ORIGIN = "workforce.unavailability";

/**
 * TRANSIENT SOLUTION: Using process_candidates as a temporary persistence layer
 * to avoid shared migrations. Requires WORKFORCE_DATABASE_PROVISIONING in the future.
 */

export const createTeamKernelAction: ActionDefinition<any, any> = {
  key: "workforce.create_team",
  moduleKey: "workforce",
  description: "Cria uma nova equipe operacional.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      name: stringProperty("Nome da equipe."),
      description: stringProperty("Descrição da equipe."),
    },
    ["name"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da equipe criada."),
  }),
  emits: ["workforce.team_created"],
  async handler(input, context) {
    const db = getDb();

    const [inserted] = await db
      .insert(teams)
      .values({
        name: input.name,
        description: input.description,
      })
      .returning({ id: teams.id });

    return {
      success: true,
      data: { id: inserted.id },
      events: [
        {
          eventType: "workforce.team_created",
          entityType: "team",
          entityId: inserted.id,
          payload: input,
        },
      ],
    };
  },
};

export const createWorkforceMemberKernelAction: ActionDefinition<any, any> = {
  key: "workforce.create_technician",
  moduleKey: "workforce",
  description: "Cria um novo membro da força de trabalho (Consolidado).",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      userId: uuidProperty("ID do usuário vinculado."),
      name: stringProperty("Nome completo."),
      teamId: uuidProperty("ID da equipe."),
      level: enumProperty(["trainee", "pleno", "especialista", "supervisor"], "Nível técnico."),
      function: stringProperty("Função."),
      competencies: { type: "array", items: { type: "string" }, description: "Competências." },
      registrationCode: stringProperty("Matrícula."),
      specialty: stringProperty("Especialidade."),
      status: enumProperty(["active", "inactive", "away", "training"], "Situação."),
    },
    ["name", "level"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID do membro criado."),
  }),
  emits: ["workforce.member_created"],
  async handler(input, context) {
    const db = getDb();

    const validated = CreateWorkforceMemberInputSchema.parse({
      ...input,
      workspaceId: context.workspaceId,
    });

    // Legacy support for core features that still consume technicianProfiles
    const [legacy] = await db
      .insert(technicianProfiles)
      .values({
        userId: validated.userId || "00000000-0000-0000-0000-000000000000",
        teamId: validated.teamId,
        level: validated.level as any,
        registrationCode: validated.registrationCode,
        specialty: validated.specialty,
        isAvailable: validated.isAvailable,
      })
      .returning({ id: technicianProfiles.id });

    const [inserted] = await db
      .insert(processCandidates)
      .values({
        workspaceId: validated.workspaceId,
        name: validated.name,
        description: `Membro: ${validated.name} (${validated.function || 'Técnico'})`,
        status: validated.status,
        origin: WORKFORCE_MEMBER_ORIGIN,
        proposedDefinition: {
          ...validated,
          legacyId: legacy.id,
        },
      })
      .returning({ id: processCandidates.id });

    return {
      success: true,
      data: { id: inserted.id },
      events: [
        {
          eventType: "workforce.member_created",
          entityType: "workforce_member",
          entityId: inserted.id,
          payload: validated,
        },
      ],
    };
  },
};

export const createTechnicianKernelAction = createWorkforceMemberKernelAction;

export const createUnavailabilityKernelAction: ActionDefinition<any, any> = {
  key: "workforce.create_unavailability",
  moduleKey: "workforce",
  description: "Registra uma indisponibilidade para um membro.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      memberId: uuidProperty("ID do membro."),
      reason: enumProperty(["vacation", "sick_leave", "training", "personal", "other"], "Motivo."),
      startsAt: stringProperty("Início (ISO)."),
      endsAt: stringProperty("Fim (ISO)."),
      notes: stringProperty("Observações."),
      status: enumProperty(["planned", "active", "completed", "cancelled"], "Status."),
    },
    ["memberId", "reason", "startsAt"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da indisponibilidade."),
  }),
  emits: ["workforce.unavailability_created"],
  async handler(input, context) {
    const db = getDb();

    // Verify member exists and belongs to workspace
    const [member] = await db
      .select()
      .from(processCandidates)
      .where(
        and(
          eq(processCandidates.id, input.memberId),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, WORKFORCE_MEMBER_ORIGIN)
        )
      )
      .limit(1);

    if (!member) {
      return { success: false, error: { code: "NOT_FOUND", message: "Membro não encontrado neste workspace." } };
    }

    const validated = CreateUnavailabilityInputSchema.parse({
      ...input,
      workspaceId: context.workspaceId,
      startsAt: new Date(input.startsAt),
      endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
    });

    const [inserted] = await db
      .insert(processCandidates)
      .values({
        workspaceId: validated.workspaceId,
        name: `Indisponibilidade: ${validated.reason}`,
        description: validated.notes,
        status: validated.status,
        origin: WORKFORCE_UNAVAILABILITY_ORIGIN,
        proposedDefinition: validated,
      })
      .returning({ id: processCandidates.id });

    return {
      success: true,
      data: { id: inserted.id },
      events: [
        {
          eventType: "workforce.unavailability_created",
          entityType: "workforce_unavailability",
          entityId: inserted.id,
          payload: validated,
        },
      ],
    };
  },
};
