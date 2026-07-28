import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { workItems } from "@/db/legacy/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  booleanProperty,
  enumProperty,
  idTitleOutputSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";
import { workItemPriorities, workItemStatuses, workItemTypes } from "./constants";
import { CreateWorkItemInputSchema, TransitionWorkItemInputSchema } from "./contracts/work-item.schema";

type CreateWorkItemInput = {
  title?: string;
  description?: string;
  type?: string;
  priority?: string;
  autoCreateServiceOrder?: boolean;
};

type TransitionWorkItemInput = {
  workItemId?: string;
  status?: string;
  note?: string;
};

export const createWorkItemKernelAction: ActionDefinition<CreateWorkItemInput, { id: string; title: string }> = {
  key: "work_items.create",
  moduleKey: "work-items",
  description: "Cria uma demanda operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título da demanda."),
      description: stringProperty("Descrição livre da demanda."),
      type: enumProperty(workItemTypes.map((type) => type.value), "Tipo de demanda."),
      priority: enumProperty(workItemPriorities.map((priority) => priority.value), "Prioridade inicial."),
      autoCreateServiceOrder: booleanProperty("Quando verdadeiro, a adaptação pode gerar uma OS por flow."),
    },
    ["title"],
  ),
  outputSchema: idTitleOutputSchema,
  emits: ["work_item.created"],
  async handler(input) {
    const parsed = CreateWorkItemInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatório." },
      };
    }

    const { title, description, type, priority, autoCreateServiceOrder } = parsed.data;

    const db = getDb();
    const [workItem] = await db
      .insert(workItems)
      .values({
        title,
        description,
        type: type as unknown as typeof workItems.$inferInsert.type,
        priority: priority as unknown as typeof workItems.$inferInsert.priority,
        status: "open",
        payload: {
          createdByKernelAction: true,
        },
      })
      .returning({
        id: workItems.id,
        title: workItems.title,
      });

    return {
      success: true,
      data: workItem,
      events: [
        {
          eventType: "work_item.created",
          entityType: "work_item",
          entityId: workItem.id,
          payload: { title: workItem.title, type, priority, autoCreateServiceOrder },
        },
      ],
    };
  },
};

export const transitionWorkItemKernelAction: ActionDefinition<
  TransitionWorkItemInput,
  { id: string; title: string; status: string }
> = {
  key: "work_items.transition",
  moduleKey: "work-items",
  targetEntity: "work_item",
  uiLabel: "Alterar Status",
  showInActionBar: true,
  description: "Transiciona o status de uma demanda.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      workItemId: uuidProperty("Demanda que será transicionada."),
      status: enumProperty(workItemStatuses.map((status) => status.value), "Novo status da demanda."),
      note: stringProperty("Observação da transição."),
    },
    ["workItemId", "status"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da demanda."),
    title: stringProperty("Título da demanda."),
    status: stringProperty("Status final."),
  }),
  emits: ["work_item.transitioned"],
  async handler(input) {
    const parsed = TransitionWorkItemInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "workItemId e obrigatório." },
      };
    }

    const { workItemId, status, note } = parsed.data;

    const db = getDb();
    const [previous] = await db
      .select({
        id: workItems.id,
        title: workItems.title,
        status: workItems.status,
        assetId: workItems.assetId,
      })
      .from(workItems)
      .where(eq(workItems.id, workItemId))
      .limit(1);

    if (!previous) {
      return { success: false, error: { code: "NOT_FOUND", message: "Demanda não encontrada." } };
    }

    const [updated] = await db
      .update(workItems)
      .set({ status: status as unknown as typeof workItems.$inferInsert.status, updatedAt: new Date() })
      .where(eq(workItems.id, previous.id))
      .returning({
        id: workItems.id,
        title: workItems.title,
        status: workItems.status,
      });

    return {
      success: true,
      data: updated,
      events: [
        {
          eventType: "work_item.transitioned",
          entityType: "work_item",
          entityId: updated.id,
          payload: {
            title: updated.title,
            from: previous.status,
            to: updated.status,
            assetId: previous.assetId,
            note: note,
          },
        },
      ],
    };
  },
};
