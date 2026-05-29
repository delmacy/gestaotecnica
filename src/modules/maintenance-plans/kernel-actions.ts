import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { maintenancePlans } from "@/db/schema";
import { runAction } from "@/platform/actions";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type CreateMaintenancePlanInput = {
  title?: string;
  assetId?: string;
  ownerTeamId?: string;
  periodStart?: string;
  periodEnd?: string;
  objective?: string;
};

export const createMaintenancePlanKernelAction: ActionDefinition<
  CreateMaintenancePlanInput,
  { id: string; title: string }
> = {
  key: "maintenance_plans.create",
  moduleKey: "maintenance-plans",
  description: "Cria um plano de manutenção preventiva.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título do plano."),
      assetId: uuidProperty("Ativo relacionado."),
      ownerTeamId: uuidProperty("Equipe responsável."),
      periodStart: stringProperty("Início do período."),
      periodEnd: stringProperty("Fim do período."),
      objective: stringProperty("Objetivo técnico."),
    },
    ["title"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do plano."),
    title: stringProperty("Título do plano."),
  }),
  emits: ["maintenance_plan.created"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title é obrigatório." },
      };
    }

    const db = getDb();
    const [plan] = await db
      .insert(maintenancePlans)
      .values({
        title,
        assetId: input.assetId,
        ownerTeamId: input.ownerTeamId,
        periodStart: input.periodStart ? new Date(input.periodStart) : undefined,
        periodEnd: input.periodEnd ? new Date(input.periodEnd) : undefined,
        objective: input.objective,
        status: "draft",
      })
      .returning({
        id: maintenancePlans.id,
        title: maintenancePlans.title,
      });

    return {
      success: true,
      data: plan,
      events: [
        {
          eventType: "maintenance_plan.created",
          entityType: "maintenance_plan",
          entityId: plan.id,
          payload: { title: plan.title, assetId: input.assetId },
        },
      ],
    };
  },
};

type GenerateMaintenanceOrderInput = {
  planId?: string;
};

export const generateMaintenanceOrderKernelAction: ActionDefinition<
  GenerateMaintenanceOrderInput,
  { id: string; code: string }
> = {
  key: "maintenance_plans.generate_order",
  moduleKey: "maintenance-plans",
  description: "Gera uma OS a partir de um plano de manutenção.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      planId: uuidProperty("Plano de manutenção de origem."),
    },
    ["planId"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da OS criada."),
    code: stringProperty("Código da OS."),
  }),
  emits: ["maintenance_plan.order_generated"],
  async handler(input, context) {
    const planId = String(input.planId ?? "").trim();
    const db = getDb();

    const [plan] = await db
      .select()
      .from(maintenancePlans)
      .where(eq(maintenancePlans.id, planId))
      .limit(1);

    if (!plan) {
      return { success: false, error: { code: "NOT_FOUND", message: "Plano não encontrado." } };
    }

    // Chamamos a action de criação de OS
    const result = await runAction("service_orders.create", {
      title: `Preventiva: ${plan.title}`,
      type: "preventiva",
      priority: plan.priority ?? "medium",
      assetId: plan.assetId,
      objective: plan.objective ?? "Manutenção preventiva programada.",
    }, context);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const serviceOrder = result.data as { id: string; code: string };

    return {
      success: true,
      data: serviceOrder,
      events: [
        {
          eventType: "maintenance_plan.order_generated",
          entityType: "maintenance_plan",
          entityId: plan.id,
          payload: {
            serviceOrderId: serviceOrder.id,
            code: serviceOrder.code,
          },
        },
      ],
    };
  },
};
