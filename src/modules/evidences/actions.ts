"use server";
import { serviceOrders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { runAction } from "@/platform/actions";
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

    const db = getDb();
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

    const context = await resolveWorkspaceContext({ source: "ui" });
    const result = await runAction(
      "evidences.attach",
      {
        title,
        description,
        fileUrl,
        mimeType,
        serviceOrderId,
        workItemId,
        assetId,
      },
      context
    );

    if (!result.success) {
      throw new Error(result.error?.message ?? "Falha ao anexar evidencia.");
    }

    const evidence = result.data as { id: string };

    revalidatePath("/");
    revalidatePath("/evidences");
    revalidatePath("/events");
    if (serviceOrderId) {
      revalidatePath(`/service-orders/${serviceOrderId}`);
    }
    if (workItemId) {
      revalidatePath(`/work-items/${workItemId}`);
    }
    if (assetId) {
      revalidatePath(`/assets/${assetId}`);
    }

    return { id: evidence.id, status: "success" };
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT")
      throw error;
    return {
      error: error instanceof Error ? error.message : "Erro inesperado.",
    };
  }
}
