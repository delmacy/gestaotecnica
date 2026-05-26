"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, shiftLogEntries, shifts } from "@/db/schema";

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

function readOptionalBoolean(formData: FormData, field: string) {
  return formData.get(field) === "on";
}

export async function createShift(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const summary = readOptionalText(formData, "summary");
  const db = getDb();

  const [shift] = await db
    .insert(shifts)
    .values({
      name,
      status: "open",
      startedAt: new Date(),
      summary,
    })
    .returning({
      id: shifts.id,
      name: shifts.name,
      status: shifts.status,
      startedAt: shifts.startedAt,
    });

  await db.insert(eventLogs).values({
    eventType: "shift.created",
    entityType: "shift",
    entityId: shift.id,
    payload: shift,
  });

  revalidatePath("/");
  revalidatePath("/shifts");
  redirect(`/shifts/${shift.id}`);
}

export async function createShiftLogEntry(formData: FormData) {
  const shiftId = readRequiredText(formData, "shiftId");
  const title = readRequiredText(formData, "title");
  const description = readOptionalText(formData, "description");
  const workItemId = readOptionalText(formData, "workItemId");
  const serviceOrderId = readOptionalText(formData, "serviceOrderId");
  const assetId = readOptionalText(formData, "assetId");
  const isPending = readOptionalBoolean(formData, "isPending");
  const db = getDb();

  const [shift] = await db
    .select({
      id: shifts.id,
      status: shifts.status,
    })
    .from(shifts)
    .where(eq(shifts.id, shiftId))
    .limit(1);

  if (!shift) {
    throw new Error("Turno nao encontrado.");
  }

  if (shift.status === "closed") {
    throw new Error("Turno fechado nao recebe novos registros.");
  }

  const [entry] = await db
    .insert(shiftLogEntries)
    .values({
      shiftId: shift.id,
      title,
      description,
      workItemId,
      serviceOrderId,
      assetId,
      isPending,
    })
    .returning({
      id: shiftLogEntries.id,
      title: shiftLogEntries.title,
      isPending: shiftLogEntries.isPending,
      workItemId: shiftLogEntries.workItemId,
      serviceOrderId: shiftLogEntries.serviceOrderId,
      assetId: shiftLogEntries.assetId,
    });

  await db.insert(eventLogs).values({
    eventType: "shift.entry_created",
    entityType: "shift",
    entityId: shift.id,
    workItemId: entry.workItemId,
    serviceOrderId: entry.serviceOrderId,
    assetId: entry.assetId,
    payload: {
      shiftId: shift.id,
      entryId: entry.id,
      title: entry.title,
      isPending: entry.isPending,
    },
  });

  revalidatePath("/");
  revalidatePath("/shifts");
  revalidatePath(`/shifts/${shift.id}`);
  redirect(`/shifts/${shift.id}`);
}

export async function closeShift(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const summary = readRequiredText(formData, "summary");
  const db = getDb();

  const [previous] = await db
    .select({
      id: shifts.id,
      name: shifts.name,
      status: shifts.status,
    })
    .from(shifts)
    .where(eq(shifts.id, id))
    .limit(1);

  if (!previous) {
    throw new Error("Turno nao encontrado.");
  }

  if (previous.status === "closed") {
    throw new Error("Turno ja esta fechado.");
  }

  await db
    .update(shifts)
    .set({
      status: "closed",
      endedAt: new Date(),
      summary,
      updatedAt: new Date(),
    })
    .where(eq(shifts.id, previous.id));

  await db.insert(eventLogs).values({
    eventType: "shift.closed",
    entityType: "shift",
    entityId: previous.id,
    payload: {
      name: previous.name,
      from: previous.status,
      to: "closed",
      summary,
    },
  });

  revalidatePath("/");
  revalidatePath("/shifts");
  revalidatePath(`/shifts/${previous.id}`);
  redirect(`/shifts/${previous.id}`);
}
