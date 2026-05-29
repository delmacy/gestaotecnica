import { count, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  eventLogs,
  serviceOrders,
  shiftLogEntries,
  shifts,
  technicianProfiles,
  users,
  workItems,
} from "@/db/schema";

export async function getOperationsSummary() {
  const db = getDb();

  const [openWorkItems, activeOrders, reviewOrders, pendingEntries, availableTechs] =
    await Promise.all([
      db.select({ value: count() }).from(workItems).where(eq(workItems.status, "open")),
      db
        .select({ value: count() })
        .from(serviceOrders)
        .where(inArray(serviceOrders.status, ["assigned", "in_progress"])),
      db
        .select({ value: count() })
        .from(serviceOrders)
        .where(eq(serviceOrders.status, "waiting_review")),
      db
        .select({ value: count() })
        .from(shiftLogEntries)
        .where(eq(shiftLogEntries.isPending, true)),
      db
        .select({ value: count() })
        .from(technicianProfiles)
        .where(eq(technicianProfiles.isAvailable, true)),
    ]);

  return [
    { label: "Demandas abertas", value: openWorkItems[0].value },
    { label: "execucao ativas", value: activeOrders[0].value },
    { label: "Em revisao", value: reviewOrders[0].value },
    { label: "Pendencias", value: pendingEntries[0].value },
    { label: "Responsavels disponiveis", value: availableTechs[0].value },
  ];
}

export async function getOperationsQueues() {
  const db = getDb();

  const [criticalWorkItems, activeOrders, pendingShiftEntries, recentEvents] =
    await Promise.all([
      db
        .select({
          id: workItems.id,
          title: workItems.title,
          status: workItems.status,
          priority: workItems.priority,
          createdAt: workItems.createdAt,
          assetId: workItems.assetId,
          assetCode: assets.code,
          assetName: assets.name,
        })
        .from(workItems)
        .leftJoin(assets, eq(workItems.assetId, assets.id))
        .where(inArray(workItems.status, ["open", "triaged", "blocked"]))
        .orderBy(desc(workItems.createdAt))
        .limit(8),
      db
        .select({
          id: serviceOrders.id,
          code: serviceOrders.code,
          title: serviceOrders.title,
          status: serviceOrders.status,
          priority: serviceOrders.priority,
          createdAt: serviceOrders.createdAt,
          assetId: serviceOrders.assetId,
          assetCode: assets.code,
          assetName: assets.name,
        })
        .from(serviceOrders)
        .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
        .where(inArray(serviceOrders.status, ["open", "assigned", "in_progress"]))
        .orderBy(desc(serviceOrders.createdAt))
        .limit(8),
      db
        .select({
          id: shiftLogEntries.id,
          title: shiftLogEntries.title,
          description: shiftLogEntries.description,
          createdAt: shiftLogEntries.createdAt,
          shiftId: shifts.id,
          shiftName: shifts.name,
          serviceOrderId: shiftLogEntries.serviceOrderId,
          serviceOrderCode: serviceOrders.code,
        })
        .from(shiftLogEntries)
        .innerJoin(shifts, eq(shiftLogEntries.shiftId, shifts.id))
        .leftJoin(serviceOrders, eq(shiftLogEntries.serviceOrderId, serviceOrders.id))
        .where(eq(shiftLogEntries.isPending, true))
        .orderBy(desc(shiftLogEntries.createdAt))
        .limit(8),
      db
        .select({
          id: eventLogs.id,
          eventType: eventLogs.eventType,
          entityType: eventLogs.entityType,
          occurredAt: eventLogs.occurredAt,
          serviceOrderId: eventLogs.serviceOrderId,
          serviceOrderCode: serviceOrders.code,
        })
        .from(eventLogs)
        .leftJoin(serviceOrders, eq(eventLogs.serviceOrderId, serviceOrders.id))
        .orderBy(desc(eventLogs.occurredAt))
        .limit(10),
    ]);

  return {
    criticalWorkItems,
    activeOrders,
    pendingShiftEntries,
    recentEvents,
  };
}

export async function getAvailableTechniciansForOperations() {
  const db = getDb();

  return db
    .select({
      id: technicianProfiles.id,
      name: users.name,
      email: users.email,
      level: technicianProfiles.level,
      specialty: technicianProfiles.specialty,
    })
    .from(technicianProfiles)
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .where(eq(technicianProfiles.isAvailable, true))
    .orderBy(desc(technicianProfiles.createdAt))
    .limit(8);
}
