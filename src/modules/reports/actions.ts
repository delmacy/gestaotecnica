"use server";
import { events as eventLogs } from "@/db/runtime/schema/workflow";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, getRuntimeDb } from "@/db";
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

async function countByStatus(
  status: "open" | "assigned" | "in_progress" | "waiting_review" | "completed" | "approved",
) {
  const db = getRuntimeDb();
  const [row] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, status));
  return row.value;
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
    openOrders,
    assignedOrders,
    inProgressOrders,
    waitingReviewOrders,
    completedOrders,
    approvedOrders,
  ] = await Promise.all([
    db.select({ value: count() }).from(workItems),
    db.select({ value: count() }).from(assets),
    db.select({ value: count() }).from(timeEntries),
    db
      .select({ value: count() })
      .from(shiftLogEntries)
      .where(eq(shiftLogEntries.isPending, true)),
    countByStatus("open"),
    countByStatus("assigned"),
    countByStatus("in_progress"),
    countByStatus("waiting_review"),
    countByStatus("completed"),
    countByStatus("approved"),
  ]);

  const payload = {
    generatedAt: new Date().toISOString(),
    totals: {
      workItems: workItemsRow[0].value,
      assets: assetsRow[0].value,
      timeEntries: timeEntriesRow[0].value,
      pendingShiftEntries: pendingShiftRows[0].value,
    },
    serviceOrders: {
      open: openOrders,
      assigned: assignedOrders,
      inProgress: inProgressOrders,
      waitingReview: waitingReviewOrders,
      completed: completedOrders,
      approved: approvedOrders,
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
