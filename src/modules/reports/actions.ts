"use server";
import { events as eventLogs } from "@/db/runtime/schema/workflow";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import {
  assets,

  reports,
  serviceOrders,
  shiftLogEntries,
  timeEntries,
  workItems,
} from "@/db/schema";
import { getReportTypeOptions } from "./queries";

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

async function readReportType(formData: FormData) {
  const reportTypes = await getReportTypeOptions();
  const value = String(formData.get("type") ?? "").trim();
  const fallback = reportTypes[0]?.value ?? "monthly_operational_summary";

  return reportTypes.some((item) => item.value === value) ? value : fallback;
}

export async function createOperationalReport(formData: FormData) {
  const title =
    readOptionalText(formData, "title") ??
    `Resumo operacional - ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`;
  const type = await readReportType(formData);
  const db = getDb();

  const [
    workItemsRow,
    assetsRow,
    timeEntriesRow,
    pendingShiftRows,
    statusCounts,
  ] = await Promise.all([
    db.select({ value: count() }).from(workItems),
    db.select({ value: count() }).from(assets),
    db.select({ value: count() }).from(timeEntries),
    db
      .select({ value: count() })
      .from(shiftLogEntries)
      .where(eq(shiftLogEntries.isPending, true)),
    db
      .select({
        status: serviceOrders.status,
        count: count(),
      })
      .from(serviceOrders)
      .groupBy(serviceOrders.status),
  ]);

  const getCount = (status: string) =>
    statusCounts.find((row) => row.status === status)?.count ?? 0;

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      workItems: workItemsRow[0].value,
      assets: assetsRow[0].value,
      timeEntries: timeEntriesRow[0].value,
      pendingShiftEntries: pendingShiftRows[0].value,
    },
    serviceOrders: {
      open: getCount("open"),
      assigned: getCount("assigned"),
      inProgress: getCount("in_progress"),
      waitingReview: getCount("waiting_review"),
      completed: getCount("completed"),
      approved: getCount("approved"),
    },
  };

  const [report] = await db
    .insert(reports)
    .values({
      title,
      type,
      payload,
    })
    .returning({
      id: reports.id,
      title: reports.title,
      type: reports.type,
    });

  await db.insert(eventLogs).values({
    eventType: "report.generated",
    entityType: "report",
    entityId: report.id,
    payload: {
      id: report.id,
      title: report.title,
      type: report.type,
    },
  });

  revalidatePath("/");
  revalidatePath("/reports");
  redirect("/reports");
}
