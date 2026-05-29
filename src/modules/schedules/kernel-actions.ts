import { getDb } from "@/db";
import { schedules } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type CreateScheduleInput = {
  technicianProfileId?: string;
  teamId?: string;
  title?: string;
  type?: string;
  startsAt?: string;
  endsAt?: string;
  notes?: string;
};

export const createScheduleKernelAction: ActionDefinition<
  CreateScheduleInput,
  { id: string; title: string }
> = {
  key: "schedules.create",
  moduleKey: "schedules",
  description: "Cria um registro de escala/horário.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      technicianProfileId: uuidProperty("Responsável escalado."),
      teamId: uuidProperty("Equipe escalada."),
      title: stringProperty("Título do período (ex: Plantão FDS)."),
      type: stringProperty("Tipo de escala (expediente, plantão, etc)."),
      startsAt: stringProperty("Início (ISO Date)."),
      endsAt: stringProperty("Fim (ISO Date)."),
      notes: stringProperty("Observações."),
    },
    ["title", "startsAt", "endsAt"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da escala."),
    title: stringProperty("Título da escala."),
  }),
  emits: ["schedule.created"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title || !input.startsAt || !input.endsAt) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title, startsAt e endsAt são obrigatórios." },
      };
    }

    const db = getDb();
    const [schedule] = await db
      .insert(schedules)
      .values({
        technicianProfileId: input.technicianProfileId,
        teamId: input.teamId,
        title,
        type: (input.type as "expediente") ?? "expediente",
        status: "planned",
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        notes: input.notes,
      })
      .returning({
        id: schedules.id,
        title: schedules.title,
      });

    return {
      success: true,
      data: schedule,
      events: [
        {
          eventType: "schedule.created",
          entityType: "schedule",
          entityId: schedule.id,
          payload: { title: schedule.title, type: input.type },
        },
      ],
    };
  },
};
