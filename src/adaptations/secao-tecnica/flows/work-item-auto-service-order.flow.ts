import { Flow, type FlowContext } from "@/platform/flows";

export class WorkItemAutoServiceOrderFlow extends Flow {
  key = "work-item-auto-service-order";
  name = "Criar OS automaticamente quando demanda solicitar execucao";
  version = "0.1.0";
  trigger = { eventType: "work_item.created" };

  async run(ctx: FlowContext) {
    if (!ctx.event.payload?.autoCreateServiceOrder) {
      ctx.skip("Demanda nao solicitou criacao automatica de OS.");
      return;
    }

    await ctx.actions.run("service_orders.create", {
      title: String(ctx.event.payload.title ?? "OS gerada a partir de demanda"),
      type: ctx.event.payload.type,
      priority: ctx.event.payload.priority,
      workItemId: ctx.event.entityId,
      objective: "Execucao criada automaticamente por flow da adaptacao secao-tecnica.",
    });
  }
}
