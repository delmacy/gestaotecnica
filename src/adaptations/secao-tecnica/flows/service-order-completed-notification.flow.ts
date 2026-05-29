import { Flow, type FlowContext } from "@/platform/flows";

export class ServiceOrderCompletedNotificationFlow extends Flow {
  key = "service-order-completed-notification";
  name = "Notificar supervisor quando OS for concluida";
  version = "0.1.0";
  trigger = { eventType: "service_order.completed" };

  async run(ctx: FlowContext) {
    await ctx.actions.run("notifications.send", {
      recipientRole: "technical_supervisor",
      title: "OS concluida",
      message: "Uma ordem de servico foi concluida e pode exigir revisao.",
    });
  }
}
