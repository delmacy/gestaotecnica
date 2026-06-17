import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getRuntimeDb } from "@/db";
import {
  integrationPlugins,
  integrationWebhookEvents,
} from "@/db/schema";
import { validateGatewayRequest } from "@/platform/integrations/auth";
import {
  toNextPlatformErrorResponse,
  toNextUnknownErrorResponse,
} from "@/platform/errors/next-response-adapter";
import { createPlatformError } from "@/platform/errors/factory";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

type WebhookBody = {
  pluginKey?: string;
  eventType?: string;
  targetModule?: string;
  source?: string;
  payload?: unknown;
};

export async function POST(request: Request) {
  const correlationId = request.headers.get("x-correlation-id") || undefined;
  const context = {
    id: `err-${randomUUID()}`,
    timestamp: new Date().toISOString(),
    correlationId,
  };

  try {
    const authError = validateGatewayRequest(request);
    if (authError) {
      const envelope = createPlatformError(
        {
          code: "WEBHOOK.AUTH.UNAUTHORIZED",
          category: "authentication",
          severity: "error",
          message: "Unauthorized webhook request",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    const body = (await request.json().catch(() => ({}))) as WebhookBody;
    const eventType = String(body.eventType ?? "").trim();

    if (!eventType) {
      const envelope = createPlatformError(
        {
          code: "VALIDATION.EVENT.MISSING_TYPE",
          category: "validation",
          severity: "warning",
          message: "The eventType field is required.",
        },
        context,
      );
      return toNextPlatformErrorResponse(envelope);
    }

    const pluginKey = body.pluginKey ? String(body.pluginKey).trim() : undefined;
    const db = getRuntimeDb();
    const [plugin] = pluginKey
      ? await db
          .select({ id: integrationPlugins.id })
          .from(integrationPlugins)
          .where(eq(integrationPlugins.key, pluginKey))
          .limit(1)
      : [];

    const [webhookEvent] = await db
      .insert(integrationWebhookEvents)
      .values({
        pluginId: plugin?.id,
        pluginKey,
        direction: "inbound",
        eventType,
        targetModule: body.targetModule ? String(body.targetModule) : undefined,
        source: body.source ? String(body.source) : undefined,
        payload: (body.payload ?? {}) as Record<string, unknown>,
        status: "received",
      })
      .returning({
        id: integrationWebhookEvents.id,
        eventType: integrationWebhookEvents.eventType,
        targetModule: integrationWebhookEvents.targetModule,
      });

    await db.insert(eventLogs).values({
      eventType: "integration.webhook_received",
      entityType: "integration_webhook_event",
      entityId: webhookEvent.id,
      payload: webhookEvent,
    });

    return NextResponse.json({
      ok: true,
      event: webhookEvent,
    });
  } catch (error) {
    return toNextUnknownErrorResponse(error, context);
  }
}
