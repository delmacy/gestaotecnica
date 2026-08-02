"use server";
import { serviceOrders } from "@/db/schema";

import { evidences } from "@/db/schema";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getRuntimeDb } from "@/db";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { getCurrentUser } from "@/modules/auth/session";
import { resolveWorkspaceContext } from "@/platform/workspace";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();

  if (!value) {
    throw new Error(`Campo obrigatorio ausente: ${field}`);
  }

  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

export async function createEvidence(prevState: unknown, formData: FormData) {
  try {
    const title = readRequiredText(formData, "title");
    const description = readOptionalText(formData, "description");
    const fileUrl = readOptionalText(formData, "fileUrl");
    const mimeType = readOptionalText(formData, "mimeType");
    const serviceOrderId = readOptionalText(formData, "serviceOrderId");
    let workItemId = readOptionalText(formData, "workItemId");
    let assetId = readOptionalText(formData, "assetId");
    const db = getRuntimeDb();

    const user = await getCurrentUser();
    if (!user) {
      return { error: "Sessão expirada. Faça login novamente." };
    }

    const context = await resolveWorkspaceContext({ source: "ui" });

    if (serviceOrderId) {
      const [serviceOrder] = await db
        .select({
          workItemId: serviceOrders.workItemId,
          assetId: serviceOrders.assetId,
        })
        .from(serviceOrders)
        .where(eq(serviceOrders.id, serviceOrderId))
        .limit(1);

      if (serviceOrder) {
        workItemId = workItemId ?? serviceOrder.workItemId ?? undefined;
        assetId = assetId ?? serviceOrder.assetId ?? undefined;
      }
    }

    const [evidence] = await db
      .insert(evidences)
      .values({
        title,
        description,
        fileUrl,
        mimeType,
        serviceOrderId,
        workItemId,
        assetId,
        createdById: user.userId,
      })
      .returning({
        id: evidences.id,
        title: evidences.title,
        serviceOrderId: evidences.serviceOrderId,
        workItemId: evidences.workItemId,
        assetId: evidences.assetId,
      });

    await db.insert(eventLogs).values({
      eventType: "evidence.created",
      entityType: "evidence",
      entityId: evidence.id,
      workspaceId: context.workspaceId,
      actorType: "user",
      actorId: user.userId,
      source: "ui",
      correlationId: context.correlationId,
      serviceOrderId: evidence.serviceOrderId,
      workItemId: evidence.workItemId,
      assetId: evidence.assetId,
      payload: {
        title: evidence.title,
        fileUrl,
        mimeType,
      },
    });

    revalidatePath("/");
    revalidatePath("/evidences");
    revalidatePath("/events");
    if (evidence.serviceOrderId) {
      revalidatePath(`/service-orders/${evidence.serviceOrderId}`);
    }
    if (evidence.workItemId) {
      revalidatePath(`/work-items/${evidence.workItemId}`);
    }
    if (evidence.assetId) {
      revalidatePath(`/assets/${evidence.assetId}`);
    }

    return {
      id: evidence.id,
      status: "success",
      receipt: {
        action: "evidence.created",
        evidenceId: evidence.id,
        status: "success",
        workspaceId: context.workspaceId,
        correlationId: context.correlationId,
        recordedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;
    return {
      error: error instanceof Error ? error.message : "Erro inesperado.",
    };
  }
}
