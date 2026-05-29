import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { serviceOrders } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  enumProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type CompleteServiceOrderInput = {
  serviceOrderId?: string;
  conclusion?: string;
};

type CreateServiceOrderInput = {
  title?: string;
  type?: string;
  objective?: string;
  priority?: "low" | "medium" | "high" | "critical";
  workItemId?: string;
  assetId?: string;
};

function createServiceOrderCode() {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = globalThis.crypto?.randomUUID?.().slice(0, 6) ?? String(Date.now()).slice(-6);
  return `OS-${timestamp}-${suffix}`;
}

export const createServiceOrderKernelAction: ActionDefinition<
  CreateServiceOrderInput,
  { id: string; code: string; title: string; status: string }
> = {
  key: "service_orders.create",
  moduleKey: "service-orders",
  description: "Cria uma ordem de serviço operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  requiredModules: ["work-items"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título da ordem de serviço."),
      type: stringProperty("Tipo operacional da ordem de serviço."),
      objective: stringProperty("Objetivo ou escopo da execução."),
      priority: enumProperty(["low", "medium", "high", "critical"], "Prioridade inicial."),
      workItemId: uuidProperty("Demanda de origem."),
      assetId: uuidProperty("Ativo relacionado."),
    },
    ["title"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da OS."),
    code: stringProperty("Código da OS."),
    title: stringProperty("Título da OS."),
    status: stringProperty("Status final."),
  }),
  emits: ["service_order.created"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatório." },
      };
    }

    const db = getDb();
    const [serviceOrder] = await db
      .insert(serviceOrders)
      .values({
        code: createServiceOrderCode(),
        title,
        type: String(input.type ?? "manutencao"),
        objective: input.objective,
        priority: input.priority ?? "medium",
        workItemId: input.workItemId,
        assetId: input.assetId,
        status: "open",
      })
      .returning({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
        status: serviceOrders.status,
      });

    return {
      success: true,
      data: serviceOrder,
      events: [
        {
          eventType: "service_order.created",
          entityType: "service_order",
          entityId: serviceOrder.id,
          payload: {
            code: serviceOrder.code,
            title: serviceOrder.title,
            workItemId: input.workItemId,
            assetId: input.assetId,
          },
        },
      ],
    };
  },
};

export const completeServiceOrderKernelAction: ActionDefinition<
  CompleteServiceOrderInput,
  { id: string; code: string; status: string }
> = {
  key: "service_orders.complete",
  moduleKey: "service-orders",
  targetEntity: "service_order",
  allowedStatuses: ["assigned", "in_progress", "waiting_review"],
  uiLabel: "Concluir Execução",
  showInActionBar: true,
  description: "Conclui uma ordem de serviço.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      serviceOrderId: uuidProperty("Ordem de serviço a ser concluída."),
      conclusion: stringProperty("Descrição da conclusão."),
    },
    ["serviceOrderId"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da OS."),
    code: stringProperty("Código da OS."),
    status: stringProperty("Status final."),
  }),
  emits: ["service_order.completed"],
  async handler(input) {
    const serviceOrderId = String(input.serviceOrderId ?? "").trim();
    if (!serviceOrderId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "serviceOrderId e obrigatório." },
      };
    }

    const db = getDb();
    const [serviceOrder] = await db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        status: serviceOrders.status,
        workItemId: serviceOrders.workItemId,
        assetId: serviceOrders.assetId,
      })
      .from(serviceOrders)
      .where(eq(serviceOrders.id, serviceOrderId))
      .limit(1);

    if (!serviceOrder) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "OS não encontrada." },
      };
    }

    const [updated] = await db
      .update(serviceOrders)
      .set({
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(serviceOrders.id, serviceOrder.id))
      .returning({
        id: serviceOrders.id,
        code: serviceOrders.code,
        status: serviceOrders.status,
      });

    return {
      success: true,
      data: updated,
      events: [
        {
          eventType: "service_order.completed",
          entityType: "service_order",
          entityId: updated.id,
          payload: {
            code: updated.code,
            statusFrom: serviceOrder.status,
            statusTo: updated.status,
            conclusion: input.conclusion,
            workItemId: serviceOrder.workItemId,
            assetId: serviceOrder.assetId,
          },
        },
      ],
    };
  },
};

