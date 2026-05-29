import { getDb } from "@/db";
import { shiftLogEntries } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  booleanProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type AddShiftLogEntryInput = {
  shiftId?: string;
  title?: string;
  description?: string;
  isPending?: boolean;
  workItemId?: string;
  serviceOrderId?: string;
  assetId?: string;
};

import { eq } from "drizzle-orm";
import { shifts } from "@/db/schema";

export const addShiftLogEntryKernelAction: ActionDefinition<
  AddShiftLogEntryInput,
  { id: string; title: string; isPending: boolean }
> = {
  key: "shift_logs.add_entry",
  moduleKey: "shifts",
  description: "Adiciona uma entrada ao livro de turno.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      shiftId: uuidProperty("Turno relacionado."),
      title: stringProperty("Título do registro."),
      description: stringProperty("Descrição do registro."),
      isPending: booleanProperty("Indica se a entrada vira pendência."),
      workItemId: uuidProperty("Demanda relacionada."),
      serviceOrderId: uuidProperty("execucao relacionada."),
      assetId: uuidProperty("Ativo relacionado."),
    },
    ["shiftId", "title"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da entrada."),
    title: stringProperty("Título do registro."),
    isPending: booleanProperty("Indica se ficou pendente."),
  }),
  emits: ["shift_log.entry_added"],
  async handler(input) {
    const shiftId = String(input.shiftId ?? "").trim();
    const title = String(input.title ?? "").trim();
    if (!shiftId || !title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "shiftId e title sao obrigatórios." },
      };
    }

    const db = getDb();
    const [entry] = await db
      .insert(shiftLogEntries)
      .values({
        shiftId,
        title,
        description: input.description,
        isPending: input.isPending ?? false,
        workItemId: input.workItemId,
        serviceOrderId: input.serviceOrderId,
        assetId: input.assetId,
      })
      .returning({
        id: shiftLogEntries.id,
        title: shiftLogEntries.title,
        isPending: shiftLogEntries.isPending,
      });

    return {
      success: true,
      data: entry,
      events: [
        {
          eventType: "shift_log.entry_added",
          entityType: "shift_log_entry",
          entityId: entry.id,
          payload: {
            shiftId,
            title,
            isPending: entry.isPending,
            workItemId: input.workItemId,
            serviceOrderId: input.serviceOrderId,
            assetId: input.assetId,
          },
        },
      ],
    };
  },
};

type OpenShiftInput = {
  name?: string;
};

export const openShiftKernelAction: ActionDefinition<
  OpenShiftInput,
  { id: string; name: string; status: string }
> = {
  key: "shifts.open",
  moduleKey: "shifts",
  description: "Abre um novo turno operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      name: stringProperty("Nome ou identificação do turno."),
    },
    ["name"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do turno."),
    name: stringProperty("Nome do turno."),
    status: stringProperty("Status inicial."),
  }),
  emits: ["shift.opened"],
  async handler(input, context) {
    const name = String(input.name ?? "").trim();
    if (!name) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "name é obrigatório." },
      };
    }

    const db = getDb();
    const [shift] = await db
      .insert(shifts)
      .values({
        name,
        status: "open",
        startedAt: new Date(),
        openedById: context.actor.type === "user" ? context.actor.id : undefined,
      })
      .returning({
        id: shifts.id,
        name: shifts.name,
        status: shifts.status,
      });

    return {
      success: true,
      data: shift,
      events: [
        {
          eventType: "shift.opened",
          entityType: "shift",
          entityId: shift.id,
          payload: { name: shift.name, status: shift.status },
        },
      ],
    };
  },
};

type CloseShiftInput = {
  shiftId?: string;
  summary?: string;
};

export const closeShiftKernelAction: ActionDefinition<
  CloseShiftInput,
  { id: string; status: string }
> = {
  key: "shifts.close",
  moduleKey: "shifts",
  description: "Encerra um turno operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      shiftId: uuidProperty("Identificador do turno."),
      summary: stringProperty("Resumo ou observações de encerramento."),
    },
    ["shiftId"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do turno."),
    status: stringProperty("Status final."),
  }),
  emits: ["shift.closed"],
  async handler(input, context) {
    const shiftId = String(input.shiftId ?? "").trim();
    if (!shiftId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "shiftId é obrigatório." },
      };
    }

    const db = getDb();
    const [previous] = await db
      .select({ id: shifts.id, status: shifts.status })
      .from(shifts)
      .where(eq(shifts.id, shiftId))
      .limit(1);

    if (!previous) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Turno não encontrado." },
      };
    }

    const [updated] = await db
      .update(shifts)
      .set({
        status: "closed",
        endedAt: new Date(),
        closedById: context.actor.type === "user" ? context.actor.id : undefined,
        summary: input.summary,
        updatedAt: new Date(),
      })
      .where(eq(shifts.id, shiftId))
      .returning({
        id: shifts.id,
        status: shifts.status,
      });

    return {
      success: true,
      data: updated,
      events: [
        {
          eventType: "shift.closed",
          entityType: "shift",
          entityId: updated.id,
          payload: { status: updated.status, summary: input.summary },
        },
      ],
    };
  },
};
