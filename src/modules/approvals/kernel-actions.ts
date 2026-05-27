import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { serviceOrders } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type RequestApprovalInput = {
  serviceOrderId?: string;
  note?: string;
};

export const requestApprovalKernelAction: ActionDefinition<
  RequestApprovalInput,
  { id: string; code: string; status: string }
> = {
  key: "approvals.request",
  moduleKey: "approvals",
  description: "Envia uma ordem de servico para revisao/aprovacao.",
  callableBy: ["ui", "integration", "automation", "system"],
  requiredModules: ["service-orders"],
  emits: ["approval.requested"],
  async handler(input) {
    const serviceOrderId = String(input.serviceOrderId ?? "").trim();
    if (!serviceOrderId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "serviceOrderId e obrigatorio." },
      };
    }

    const db = getDb();
    const [previous] = await db
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

    if (!previous) {
      return { success: false, error: { code: "NOT_FOUND", message: "OS nao encontrada." } };
    }

    const [updated] = await db
      .update(serviceOrders)
      .set({
        status: "waiting_review",
        completedAt: previous.status === "completed" ? undefined : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(serviceOrders.id, previous.id))
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
          eventType: "approval.requested",
          entityType: "service_order",
          entityId: updated.id,
          payload: {
            code: updated.code,
            from: previous.status,
            to: updated.status,
            note: input.note,
            workItemId: previous.workItemId,
            assetId: previous.assetId,
          },
        },
      ],
    };
  },
};
