import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  serviceOrders,
  shiftLogEntries,
  shifts,
  workItems,
} from "@/db/schema";

export async function getShifts() {
  const db = getDb();

  return db
    .select({
      id: shifts.id,
      name: shifts.name,
      status: shifts.status,
      startedAt: shifts.startedAt,
      endedAt: shifts.endedAt,
      summary: shifts.summary,
      createdAt: shifts.createdAt,
    })
    .from(shifts)
    .orderBy(desc(shifts.createdAt))
    .limit(50);
}

export async function getShiftById(id: string) {
  const db = getDb();

  const [shift] = await db
    .select({
      id: shifts.id,
      name: shifts.name,
      status: shifts.status,
      startedAt: shifts.startedAt,
      endedAt: shifts.endedAt,
      summary: shifts.summary,
      createdAt: shifts.createdAt,
      updatedAt: shifts.updatedAt,
    })
    .from(shifts)
    .where(eq(shifts.id, id))
    .limit(1);

  return shift ?? null;
}

export async function getShiftEntries(shiftId: string) {
  const db = getDb();

  return db
    .select({
      id: shiftLogEntries.id,
      title: shiftLogEntries.title,
      description: shiftLogEntries.description,
      isPending: shiftLogEntries.isPending,
      createdAt: shiftLogEntries.createdAt,
      workItemId: shiftLogEntries.workItemId,
      workItemTitle: workItems.title,
      serviceOrderId: shiftLogEntries.serviceOrderId,
      serviceOrderCode: serviceOrders.code,
      serviceOrderTitle: serviceOrders.title,
      assetId: shiftLogEntries.assetId,
      assetCode: assets.code,
      assetName: assets.name,
    })
    .from(shiftLogEntries)
    .leftJoin(workItems, eq(shiftLogEntries.workItemId, workItems.id))
    .leftJoin(serviceOrders, eq(shiftLogEntries.serviceOrderId, serviceOrders.id))
    .leftJoin(assets, eq(shiftLogEntries.assetId, assets.id))
    .where(eq(shiftLogEntries.shiftId, shiftId))
    .orderBy(desc(shiftLogEntries.createdAt));
}

export async function getShiftSummary() {
  const db = getDb();

  const [openRow] = await db
    .select({ value: count() })
    .from(shifts)
    .where(eq(shifts.status, "open"));
  const [closedRow] = await db
    .select({ value: count() })
    .from(shifts)
    .where(eq(shifts.status, "closed"));
  const [pendingRow] = await db
    .select({ value: count() })
    .from(shiftLogEntries)
    .where(eq(shiftLogEntries.isPending, true));

  return [
    { label: "Turnos abertos", value: openRow.value },
    { label: "Turnos fechados", value: closedRow.value },
    { label: "Pendencias", value: pendingRow.value },
  ];
}

export async function getShiftLinkOptions() {
  const db = getDb();
  const [workItemRows, serviceOrderRows, assetRows] = await Promise.all([
    db
      .select({
        id: workItems.id,
        label: workItems.title,
      })
      .from(workItems)
      .orderBy(desc(workItems.createdAt))
      .limit(30),
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
      })
      .from(serviceOrders)
      .orderBy(desc(serviceOrders.createdAt))
      .limit(30),
    db
      .select({
        id: assets.id,
        code: assets.code,
        name: assets.name,
      })
      .from(assets)
      .orderBy(desc(assets.createdAt))
      .limit(30),
  ]);

  return {
    workItems: workItemRows,
    serviceOrders: serviceOrderRows,
    assets: assetRows,
  };
}
