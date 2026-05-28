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

export class InventoryUsageFlow extends Flow {
  key = "inventory-usage-log";
  name = "Registrar uso de materiais no estoque";
  version = "0.1.0";
  trigger = { eventType: "service_order.completed" };

  async run(ctx: FlowContext) {
    const partsUsed = ctx.event.payload?.partsUsed as Array<{ itemId: string; quantity: number }> | undefined;

    if (!partsUsed || partsUsed.length === 0) {
      ctx.skip("Nenhum material utilizado na OS.");
      return;
    }

    for (const part of partsUsed) {
      await ctx.actions.run("inventory.adjust_stock", {
        itemId: part.itemId,
        movementType: "outbound",
        quantity: part.quantity,
        serviceOrderId: ctx.event.entityId,
        notes: `Consumo automático pela OS ${ctx.event.payload?.code}`,
      });
    }

    ctx.logger.info(`${partsUsed.length} itens baixados do estoque.`);
  }
}
