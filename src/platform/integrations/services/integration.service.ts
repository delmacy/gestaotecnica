import { runtimeDb } from "@/db";
import { webhookDeliveries, webhooks } from "@/db/runtime/schema/integrations";
import { eq, and, sql } from "drizzle-orm";

export class IntegrationService {
  async queueWebhook(params: {
    workspaceId: string;
    eventType: string;
    payload: unknown;
  }) {
    // 1. Find active webhooks for this event type
    const activeWebhooks = await runtimeDb
      .select()
      .from(webhooks)
      .where(
        and(
          eq(webhooks.workspaceId, params.workspaceId),
          eq(webhooks.eventType, params.eventType),
          eq(webhooks.status, "active")
        )
      );

    // 2. Create delivery records (Outbox)
    for (const webhook of activeWebhooks) {
      await runtimeDb.insert(webhookDeliveries).values({
        workspaceId: params.workspaceId,
        webhookId: webhook.id,
        eventType: params.eventType,
        payload: params.payload as Record<string, unknown>,
        status: "pending",
        attempts: 0,
      });
    }
  }

  async processOutbox() {
    const pending = await runtimeDb
      .select()
      .from(webhookDeliveries)
      .where(eq(webhookDeliveries.status, "pending"))
      .limit(10);

    for (const delivery of pending) {
      await this.deliver(delivery.id);
    }
  }

  private async deliver(deliveryId: string) {
    // Mock delivery implementation
    await runtimeDb.update(webhookDeliveries)
      .set({
        status: "delivered",
        deliveredAt: new Date(),
        attempts: 1,
        lastAttemptAt: new Date()
      })
      .where(eq(webhookDeliveries.id, deliveryId));

    console.log(`[Webhook] Delivered: ${deliveryId}`);
  }
}
