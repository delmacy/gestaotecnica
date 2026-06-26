import { count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  reports,
  serviceOrders,
  shiftLogEntries,
  timeEntries,
  workItems,
} from "@/db/schema";
import { workspaces } from "@/db/runtime/schema/workspace";
import { getWorkspaceReportTemplateOptions } from "@/platform/workspaces/catalogs";

type ServiceOrderStatus =
  | "draft"
  | "open"
  | "assigned"
  | "in_progress"
  | "waiting_review"
  | "completed"
  | "approved"
  | "cancelled";

async function countServiceOrdersByStatus(status: ServiceOrderStatus) {
  const db = getDb();
  const [row] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, status));

  return row.value;
}

export async function getOperationalReportData() {
  const db = getDb();

  const [
    workItemsRow,
    assetsRow,
    pendingShiftRow,
    totalHoursRow,
    openOrders,
    assignedOrders,
    inProgressOrders,
    waitingReviewOrders,
    completedOrders,
    approvedOrders,
    recentOrders,
  ] = await Promise.all([
    db.select({ value: count() }).from(workItems),
    db.select({ value: count() }).from(assets),
    db
      .select({ value: count() })
      .from(shiftLogEntries)
      .where(eq(shiftLogEntries.isPending, true)),
    db
      .select({
        value: sql<number>`coalesce(sum(${timeEntries.durationMinutes}), 0)`,
      })
      .from(timeEntries),
    countServiceOrdersByStatus("open"),
    countServiceOrdersByStatus("assigned"),
    countServiceOrdersByStatus("in_progress"),
    countServiceOrdersByStatus("waiting_review"),
    countServiceOrdersByStatus("completed"),
    countServiceOrdersByStatus("approved"),
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
        status: serviceOrders.status,
        priority: serviceOrders.priority,
        createdAt: serviceOrders.createdAt,
      })
      .from(serviceOrders)
      .orderBy(desc(serviceOrders.createdAt))
      .limit(8),
  ]);

  const totalMinutes = Number(totalHoursRow[0].value ?? 0);

  return {
    cards: [
      { label: "Demandas", value: workItemsRow[0].value },
      { label: "Ativos", value: assetsRow[0].value },
      { label: "Horas apontadas", value: Math.round(totalMinutes / 60) },
      { label: "Pendencias de turno", value: pendingShiftRow[0].value },
    ],
    serviceOrders: [
      { label: "Abertas", value: openOrders },
      { label: "Atribuidas", value: assignedOrders },
      { label: "Em execucao", value: inProgressOrders },
      { label: "Em revisao", value: waitingReviewOrders },
      { label: "Concluidas", value: completedOrders },
      { label: "Aprovadas", value: approvedOrders },
    ],
    recentOrders,
  };
}

export async function getReports() {
  const db = getDb();

  return db
    .select({
      id: reports.id,
      title: reports.title,
      type: reports.type,
      payload: reports.payload,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .orderBy(desc(reports.createdAt))
    .limit(20);
}

export async function getReportTypeOptions() {
  return getWorkspaceReportTemplateOptions();
}
