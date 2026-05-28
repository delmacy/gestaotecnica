import { Flow, type FlowContext } from "@/platform/flows";

export class ServiceOrderGovernanceFlow extends Flow {
  key = "service-order-governance";
  name = "Fluxo de Governança de OS (Aprovação e Documento)";
  version = "0.1.0";
  trigger = { eventType: "service_order.completed" };

  async run(ctx: FlowContext) {
    // 1. Quando uma OS é concluída, solicitamos aprovação automaticamente
    await ctx.actions.run("approvals.request", {
      serviceOrderId: ctx.event.entityId,
      note: "Solicitação automática após conclusão da execução.",
    });

    ctx.logger.info("Solicitação de aprovação enviada.");
  }
}

export class ServiceOrderApprovedDocumentFlow extends Flow {
  key = "service-order-approved-document";
  name = "Gerar documento quando OS for aprovada";
  version = "0.1.0";
  trigger = { eventType: "approval.decided" };

  async run(ctx: FlowContext) {
    if (ctx.event.payload?.decision !== "approve") {
      ctx.skip("OS não aprovada, pulando geração de documento.");
      return;
    }

    // 2. Quando a aprovação é concedida, geramos o documento técnico
    await ctx.actions.run("documents.generate", {
      title: `Relatório Técnico: ${ctx.event.payload.code}`,
      documentType: "technical_report",
      serviceOrderId: ctx.event.entityId,
      workItemId: ctx.event.payload.workItemId,
      assetId: ctx.event.payload.assetId,
      content: "Documento gerado automaticamente após aprovação técnica.",
    });

    ctx.logger.info("Documento técnico gerado.");
  }
}

export class PeriodicMaintenanceGeneratorFlow extends Flow {
  key = "periodic-maintenance-generator";
  name = "Gerador de manutenção periódica";
  version = "0.1.0";
  trigger = { eventType: "maintenance_plan.created" };

  async run(ctx: FlowContext) {
    // Simulação: Quando um plano é criado, geramos a primeira OS imediatamente
    await ctx.actions.run("maintenance_plans.generate_order", {
      planId: ctx.event.entityId,
    });

    ctx.logger.info("Primeira OS de manutenção preventiva gerada.");
  }
}
