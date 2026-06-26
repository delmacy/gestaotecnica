import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  reports,
  serviceOrders,
  shiftLogEntries,
  timeEntries,
  workItems,
} from "@/db/schema";
import { getWorkspaceReportTemplateOptions } from "@/platform/workspaces/catalogs";

export async function getOperationalReportData() {
  const db = getDb();

  const [
    workItemsRow,
    assetsRow,
    pendingShiftRow,
    totalHoursRow,
    statusCounts,
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
    db
      .select({
        status: serviceOrders.status,
        count: count(),
      })
      .from(serviceOrders)
      .groupBy(serviceOrders.status),
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

  const getCount = (status: string) =>
    statusCounts.find((row: { status: string | null; count: number }) => row.status === status)
      ?.count ?? 0;

  return {
    cards: [
      { label: "Demandas", value: workItemsRow[0].value },
      { label: "Ativos", value: assetsRow[0].value },
      { label: "Horas apontadas", value: Math.round(totalMinutes / 60) },
      { label: "Pendencias de turno", value: pendingShiftRow[0].value },
    ],
    serviceOrders: [
      { label: "Abertas", value: getCount("open") },
      { label: "Atribuidas", value: getCount("assigned") },
      { label: "Em execucao", value: getCount("in_progress") },
      { label: "Em revisao", value: getCount("waiting_review") },
      { label: "Concluidas", value: getCount("completed") },
      { label: "Aprovadas", value: getCount("approved") },
    ],
    recentOrders,
  };
}

export type GetReportsOptions = {
  type?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
};

export async function getReports(options: GetReportsOptions = {}) {
  const { type, startDate, endDate, limit = 20, offset = 0 } = options;
  const db = getDb();

  const conditions = [];

  if (type) {
    conditions.push(eq(reports.type, type));
  }

  if (startDate) {
    conditions.push(gte(reports.createdAt, startDate));
  }

  if (endDate) {
    conditions.push(lte(reports.createdAt, endDate));
  }

  return db
    .select({
      id: reports.id,
      title: reports.title,
      type: reports.type,
      payload: reports.payload,
      createdAt: reports.createdAt,
    })
    .from(reports)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(reports.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getReportTypeOptions() {
  return getWorkspaceReportTemplateOptions();
}
