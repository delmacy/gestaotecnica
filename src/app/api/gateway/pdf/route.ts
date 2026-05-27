import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { eventLogs, integrationWebhookEvents } from "@/db/schema";
import { validateGatewayRequest } from "@/platform/integrations/auth";

export const dynamic = "force-dynamic";

type PdfRequestBody = {
  provider?: string;
  templateKey?: string;
  reportId?: string;
  title?: string;
  callbackUrl?: string;
  payload?: unknown;
};

export async function POST(request: Request) {
  const authError = validateGatewayRequest(request);
  if (authError) return authError;

  const body = (await request.json().catch(() => ({}))) as PdfRequestBody;
  const db = getDb();
  const payload = {
    provider: body.provider ?? "internal",
    templateKey: body.templateKey,
    reportId: body.reportId,
    title: body.title,
    callbackUrl: body.callbackUrl,
    payload: body.payload ?? {},
  };

  const [pdfEvent] = await db
    .insert(integrationWebhookEvents)
    .values({
      direction: "outbound",
      eventType: "pdf.generate.requested",
      targetModule: "reports",
      pluginKey: body.provider,
      source: "api.gateway.pdf",
      status: "received",
      payload,
    })
    .returning({
      id: integrationWebhookEvents.id,
      eventType: integrationWebhookEvents.eventType,
      status: integrationWebhookEvents.status,
    });

  await db.insert(eventLogs).values({
    eventType: "pdf.generate_requested",
    entityType: "integration_webhook_event",
    entityId: pdfEvent.id,
    payload,
  });

  return NextResponse.json({
    ok: true,
    mode: "plugin-contract",
    message: "Solicitacao de PDF registrada. Um provider interno ou externo pode consumir este evento.",
    request: pdfEvent,
  });
}
