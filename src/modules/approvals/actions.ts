"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, serviceOrders } from "@/db/schema";

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

async function getServiceOrderForReview(id: string) {
  const db = getDb();
  const [serviceOrder] = await db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      status: serviceOrders.status,
      workItemId: serviceOrders.workItemId,
      assetId: serviceOrders.assetId,
    })
    .from(serviceOrders)
    .where(eq(serviceOrders.id, id))
    .limit(1);

  if (!serviceOrder) {
    throw new Error("OS nao encontrada.");
  }

  return serviceOrder;
}

function revalidateServiceOrderSurfaces(serviceOrder: {
  id: string;
  workItemId: string | null;
  assetId: string | null;
}) {
  revalidatePath("/");
  revalidatePath("/approvals");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${serviceOrder.id}`);
  if (serviceOrder.workItemId) {
    revalidatePath(`/work-items/${serviceOrder.workItemId}`);
  }
  if (serviceOrder.assetId) {
    revalidatePath(`/assets/${serviceOrder.assetId}`);
  }
}

export async function submitServiceOrderForReview(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const note = readOptionalText(formData, "note");
  const db = getDb();
  const previous = await getServiceOrderForReview(id);

  if (previous.status === "approved" || previous.status === "cancelled") {
    throw new Error("OS aprovada ou cancelada nao pode ser enviada para revisao.");
  }

  await db
    .update(serviceOrders)
    .set({
      status: "waiting_review",
      completedAt: previous.status === "completed" ? undefined : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(serviceOrders.id, previous.id));

  await db.insert(eventLogs).values({
    eventType: "service_order.review_requested",
    entityType: "service_order",
    entityId: previous.id,
    serviceOrderId: previous.id,
    workItemId: previous.workItemId,
    assetId: previous.assetId,
    payload: {
      code: previous.code,
      from: previous.status,
      to: "waiting_review",
      note,
    },
  });

  revalidateServiceOrderSurfaces(previous);
  redirect(`/service-orders/${previous.id}`);
}

export async function approveServiceOrder(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const note = readOptionalText(formData, "note");
  const db = getDb();
  const previous = await getServiceOrderForReview(id);

  if (previous.status !== "waiting_review" && previous.status !== "completed") {
    throw new Error("Apenas OS em revisao ou concluidas podem ser aprovadas.");
  }

  await db
    .update(serviceOrders)
    .set({
      status: "approved",
      approvedAt: new Date(),
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(serviceOrders.id, previous.id));

  await db.insert(eventLogs).values({
    eventType: "service_order.approved",
    entityType: "service_order",
    entityId: previous.id,
    serviceOrderId: previous.id,
    workItemId: previous.workItemId,
    assetId: previous.assetId,
    payload: {
      code: previous.code,
      from: previous.status,
      to: "approved",
      note,
    },
  });

  revalidateServiceOrderSurfaces(previous);
  redirect("/approvals");
}

export async function returnServiceOrderForExecution(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const note = readRequiredText(formData, "note");
  const db = getDb();
  const previous = await getServiceOrderForReview(id);

  if (previous.status !== "waiting_review" && previous.status !== "completed") {
    throw new Error("Apenas OS em revisao ou concluidas podem voltar para execucao.");
  }

  await db
    .update(serviceOrders)
    .set({
      status: "in_progress",
      updatedAt: new Date(),
    })
    .where(eq(serviceOrders.id, previous.id));

  await db.insert(eventLogs).values({
    eventType: "service_order.review_returned",
    entityType: "service_order",
    entityId: previous.id,
    serviceOrderId: previous.id,
    workItemId: previous.workItemId,
    assetId: previous.assetId,
    payload: {
      code: previous.code,
      from: previous.status,
      to: "in_progress",
      note,
    },
  });

  revalidateServiceOrderSurfaces(previous);
  redirect("/approvals");
}
