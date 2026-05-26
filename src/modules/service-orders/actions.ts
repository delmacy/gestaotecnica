"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import {
  eventLogs,
  evidences,
  serviceOrderAssignments,
  serviceOrders,
  technicianProfiles,
  timeEntries,
  users,
  workItems,
} from "@/db/schema";
import { generateServiceOrderCode } from "./code";
import {
  type ServiceOrderStatusValue,
  serviceOrderStatuses,
} from "./constants";

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

function readRequiredDate(formData: FormData, field: string) {
  const value = readRequiredText(formData, field);
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data invalida: ${field}`);
  }

  return date;
}

function readOptionalDate(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data invalida: ${field}`);
  }

  return date;
}

function readEnum<T extends string>(
  formData: FormData,
  field: string,
  allowedValues: readonly { value: T; label: string }[],
  fallback: T,
) {
  const value = String(formData.get(field) ?? fallback);
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export async function createServiceOrderFromWorkItem(formData: FormData) {
  const workItemId = readRequiredText(formData, "workItemId");
  const objective = readOptionalText(formData, "objective");
  const db = getDb();

  const [workItem] = await db
    .select({
      id: workItems.id,
      title: workItems.title,
      description: workItems.description,
      priority: workItems.priority,
      assetId: workItems.assetId,
      status: workItems.status,
    })
    .from(workItems)
    .where(eq(workItems.id, workItemId))
    .limit(1);

  if (!workItem) {
    throw new Error("Demanda nao encontrada.");
  }

  const [serviceOrder] = await db
    .insert(serviceOrders)
    .values({
      workItemId: workItem.id,
      assetId: workItem.assetId,
      code: generateServiceOrderCode(),
      title: workItem.title,
      objective: objective ?? workItem.description,
      priority: workItem.priority,
      status: "open",
    })
    .returning({
      id: serviceOrders.id,
      code: serviceOrders.code,
      title: serviceOrders.title,
      status: serviceOrders.status,
      priority: serviceOrders.priority,
      assetId: serviceOrders.assetId,
      workItemId: serviceOrders.workItemId,
    });

  await db
    .update(workItems)
    .set({
      status: "planned",
      updatedAt: new Date(),
    })
    .where(eq(workItems.id, workItem.id));

  await db.insert(eventLogs).values([
    {
      eventType: "service_order.created",
      entityType: "service_order",
      entityId: serviceOrder.id,
      serviceOrderId: serviceOrder.id,
      workItemId: workItem.id,
      assetId: serviceOrder.assetId,
      payload: {
        code: serviceOrder.code,
        title: serviceOrder.title,
        status: serviceOrder.status,
        priority: serviceOrder.priority,
        source: "work_item",
      },
    },
    {
      eventType: "work_item.service_order_created",
      entityType: "work_item",
      entityId: workItem.id,
      workItemId: workItem.id,
      serviceOrderId: serviceOrder.id,
      assetId: serviceOrder.assetId,
      payload: {
        code: serviceOrder.code,
        serviceOrderId: serviceOrder.id,
        statusFrom: workItem.status,
        statusTo: "planned",
      },
    },
  ]);

  revalidatePath("/");
  revalidatePath("/work-items");
  revalidatePath(`/work-items/${workItem.id}`);
  revalidatePath("/service-orders");
  redirect(`/service-orders/${serviceOrder.id}`);
}

export async function updateServiceOrderStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<ServiceOrderStatusValue>(
    formData,
    "status",
    serviceOrderStatuses,
    "open",
  );
  const note = readOptionalText(formData, "note");
  const db = getDb();

  const [previous] = await db
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

  if (!previous) {
    throw new Error("OS nao encontrada.");
  }

  const completedAt = status === "completed" ? new Date() : undefined;
  const approvedAt = status === "approved" ? new Date() : undefined;

  const [updated] = await db
    .update(serviceOrders)
    .set({
      status,
      completedAt,
      approvedAt,
      updatedAt: new Date(),
    })
    .where(eq(serviceOrders.id, id))
    .returning({
      id: serviceOrders.id,
      code: serviceOrders.code,
      status: serviceOrders.status,
    });

  await db.insert(eventLogs).values({
    eventType: "service_order.status_changed",
    entityType: "service_order",
    entityId: updated.id,
    serviceOrderId: updated.id,
    workItemId: previous.workItemId,
    assetId: previous.assetId,
    payload: {
      code: updated.code,
      from: previous.status,
      to: updated.status,
      note,
    },
  });

  revalidatePath("/");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${id}`);
  if (previous.workItemId) {
    revalidatePath(`/work-items/${previous.workItemId}`);
  }
  if (previous.assetId) {
    revalidatePath(`/assets/${previous.assetId}`);
  }
  redirect(`/service-orders/${id}`);
}

export async function assignTechnicianToServiceOrder(formData: FormData) {
  const serviceOrderId = readRequiredText(formData, "serviceOrderId");
  const technicianProfileId = readRequiredText(formData, "technicianProfileId");
  const role = readOptionalText(formData, "role") ?? "executor";
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
    .where(eq(serviceOrders.id, serviceOrderId))
    .limit(1);

  if (!serviceOrder) {
    throw new Error("OS nao encontrada.");
  }

  const [technician] = await db
    .select({
      id: technicianProfiles.id,
      name: users.name,
      level: technicianProfiles.level,
      isAvailable: technicianProfiles.isAvailable,
    })
    .from(technicianProfiles)
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .where(eq(technicianProfiles.id, technicianProfileId))
    .limit(1);

  if (!technician) {
    throw new Error("Tecnico nao encontrado.");
  }

  const [existingAssignment] = await db
    .select({
      id: serviceOrderAssignments.id,
    })
    .from(serviceOrderAssignments)
    .where(
      and(
        eq(serviceOrderAssignments.serviceOrderId, serviceOrder.id),
        eq(serviceOrderAssignments.technicianProfileId, technician.id),
        isNull(serviceOrderAssignments.releasedAt),
      ),
    )
    .limit(1);

  if (existingAssignment) {
    throw new Error("Este tecnico ja esta atribuido a esta OS.");
  }

  const [assignment] = await db
    .insert(serviceOrderAssignments)
    .values({
      serviceOrderId: serviceOrder.id,
      technicianProfileId: technician.id,
      role,
    })
    .returning({
      id: serviceOrderAssignments.id,
      serviceOrderId: serviceOrderAssignments.serviceOrderId,
      technicianProfileId: serviceOrderAssignments.technicianProfileId,
      role: serviceOrderAssignments.role,
      assignedAt: serviceOrderAssignments.assignedAt,
    });

  const statusTo = serviceOrder.status === "open" ? "assigned" : serviceOrder.status;

  if (statusTo !== serviceOrder.status) {
    await db
      .update(serviceOrders)
      .set({
        status: statusTo,
        updatedAt: new Date(),
      })
      .where(eq(serviceOrders.id, serviceOrder.id));
  }

  await db.insert(eventLogs).values({
    eventType: "service_order.technician_assigned",
    entityType: "service_order",
    entityId: serviceOrder.id,
    serviceOrderId: serviceOrder.id,
    workItemId: serviceOrder.workItemId,
    assetId: serviceOrder.assetId,
    payload: {
      assignmentId: assignment.id,
      code: serviceOrder.code,
      technicianProfileId: technician.id,
      technicianName: technician.name,
      technicianLevel: technician.level,
      technicianAvailable: technician.isAvailable,
      role: assignment.role,
      statusFrom: serviceOrder.status,
      statusTo,
    },
  });

  revalidatePath("/");
  revalidatePath("/workforce");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${serviceOrder.id}`);
  if (serviceOrder.workItemId) {
    revalidatePath(`/work-items/${serviceOrder.workItemId}`);
  }
  if (serviceOrder.assetId) {
    revalidatePath(`/assets/${serviceOrder.assetId}`);
  }
  redirect(`/service-orders/${serviceOrder.id}`);
}

export async function createServiceOrderTimeEntry(formData: FormData) {
  const serviceOrderId = readRequiredText(formData, "serviceOrderId");
  const technicianProfileId = readRequiredText(formData, "technicianProfileId");
  const startedAt = readRequiredDate(formData, "startedAt");
  const endedAt = readOptionalDate(formData, "endedAt");
  const notes = readOptionalText(formData, "notes");
  const db = getDb();

  if (endedAt && endedAt < startedAt) {
    throw new Error("Fim do apontamento nao pode ser anterior ao inicio.");
  }

  const [serviceOrder] = await db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      status: serviceOrders.status,
      workItemId: serviceOrders.workItemId,
      assetId: serviceOrders.assetId,
    })
    .from(serviceOrders)
    .where(eq(serviceOrders.id, serviceOrderId))
    .limit(1);

  if (!serviceOrder) {
    throw new Error("OS nao encontrada.");
  }

  const [assignment] = await db
    .select({
      id: serviceOrderAssignments.id,
      technicianName: users.name,
    })
    .from(serviceOrderAssignments)
    .innerJoin(
      technicianProfiles,
      eq(serviceOrderAssignments.technicianProfileId, technicianProfiles.id),
    )
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .where(
      and(
        eq(serviceOrderAssignments.serviceOrderId, serviceOrder.id),
        eq(serviceOrderAssignments.technicianProfileId, technicianProfileId),
        isNull(serviceOrderAssignments.releasedAt),
      ),
    )
    .limit(1);

  if (!assignment) {
    throw new Error("Tecnico precisa estar atribuido ativamente a esta OS.");
  }

  const durationMinutes = endedAt
    ? Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000))
    : undefined;

  const [timeEntry] = await db
    .insert(timeEntries)
    .values({
      serviceOrderId: serviceOrder.id,
      technicianProfileId,
      startedAt,
      endedAt,
      durationMinutes,
      notes,
    })
    .returning({
      id: timeEntries.id,
      startedAt: timeEntries.startedAt,
      endedAt: timeEntries.endedAt,
      durationMinutes: timeEntries.durationMinutes,
      notes: timeEntries.notes,
    });

  const statusTo =
    serviceOrder.status === "open" || serviceOrder.status === "assigned"
      ? "in_progress"
      : serviceOrder.status;

  if (statusTo !== serviceOrder.status) {
    await db
      .update(serviceOrders)
      .set({
        status: statusTo,
        updatedAt: new Date(),
      })
      .where(eq(serviceOrders.id, serviceOrder.id));
  }

  await db.insert(eventLogs).values({
    eventType: "service_order.time_logged",
    entityType: "service_order",
    entityId: serviceOrder.id,
    serviceOrderId: serviceOrder.id,
    workItemId: serviceOrder.workItemId,
    assetId: serviceOrder.assetId,
    payload: {
      code: serviceOrder.code,
      timeEntryId: timeEntry.id,
      technicianProfileId,
      technicianName: assignment.technicianName,
      startedAt: timeEntry.startedAt,
      endedAt: timeEntry.endedAt,
      durationMinutes: timeEntry.durationMinutes,
      notes: timeEntry.notes,
      statusFrom: serviceOrder.status,
      statusTo,
    },
  });

  revalidatePath("/");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${serviceOrder.id}`);
  if (serviceOrder.workItemId) {
    revalidatePath(`/work-items/${serviceOrder.workItemId}`);
  }
  if (serviceOrder.assetId) {
    revalidatePath(`/assets/${serviceOrder.assetId}`);
  }
  redirect(`/service-orders/${serviceOrder.id}`);
}

export async function createServiceOrderEvidence(formData: FormData) {
  const serviceOrderId = readRequiredText(formData, "serviceOrderId");
  const title = readRequiredText(formData, "title");
  const description = readOptionalText(formData, "description");
  const fileUrl = readOptionalText(formData, "fileUrl");
  const mimeType = readOptionalText(formData, "mimeType");
  const db = getDb();

  const [serviceOrder] = await db
    .select({
      id: serviceOrders.id,
      code: serviceOrders.code,
      workItemId: serviceOrders.workItemId,
      assetId: serviceOrders.assetId,
    })
    .from(serviceOrders)
    .where(eq(serviceOrders.id, serviceOrderId))
    .limit(1);

  if (!serviceOrder) {
    throw new Error("OS nao encontrada.");
  }

  const [evidence] = await db
    .insert(evidences)
    .values({
      serviceOrderId: serviceOrder.id,
      workItemId: serviceOrder.workItemId,
      assetId: serviceOrder.assetId,
      title,
      description,
      fileUrl,
      mimeType,
    })
    .returning({
      id: evidences.id,
      title: evidences.title,
      description: evidences.description,
      fileUrl: evidences.fileUrl,
      mimeType: evidences.mimeType,
    });

  await db.insert(eventLogs).values({
    eventType: "service_order.evidence_added",
    entityType: "service_order",
    entityId: serviceOrder.id,
    serviceOrderId: serviceOrder.id,
    workItemId: serviceOrder.workItemId,
    assetId: serviceOrder.assetId,
    payload: {
      code: serviceOrder.code,
      evidenceId: evidence.id,
      title: evidence.title,
      description: evidence.description,
      fileUrl: evidence.fileUrl,
      mimeType: evidence.mimeType,
    },
  });

  revalidatePath("/");
  revalidatePath("/service-orders");
  revalidatePath(`/service-orders/${serviceOrder.id}`);
  if (serviceOrder.workItemId) {
    revalidatePath(`/work-items/${serviceOrder.workItemId}`);
  }
  if (serviceOrder.assetId) {
    revalidatePath(`/assets/${serviceOrder.assetId}`);
  }
  redirect(`/service-orders/${serviceOrder.id}`);
}
