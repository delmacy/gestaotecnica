import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { serviceOrders } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type CompleteServiceOrderInput = {
  serviceOrderId?: string;
  conclusion?: string;
};

export const completeServiceOrderKernelAction: ActionDefinition<
  CompleteServiceOrderInput,
  { id: string; code: string; status: string }
> = {
  key: "service_orders.complete",
  moduleKey: "service-orders",
  description: "Conclui uma ordem de servico.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["service_order.completed"],
  async handler(input) {
    const serviceOrderId = String(input.serviceOrderId ?? "").trim();
    if (!serviceOrderId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "serviceOrderId e obrigatorio." },
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
        error: { code: "NOT_FOUND", message: "OS nao encontrada." },
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
