import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  reports,
  serviceOrders,
  shiftLogEntries,
  timeEntries,
  workItems,
} from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type GenerateOperationalReportInput = {
  title?: string;
  type?: string;
};

async function countByStatus(
  status: "open" | "assigned" | "in_progress" | "waiting_review" | "completed" | "approved",
) {
  const db = getDb();
  const [row] = await db
    .select({ value: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.status, status));
  return row.value;
}

export const generateOperationalReportKernelAction: ActionDefinition<
  GenerateOperationalReportInput,
  { id: string; title: string; type: string }
> = {
  key: "reports.generate_operational",
  moduleKey: "reports",
  description: "Gera um resumo operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["report.generated"],
  async handler(input) {
    const title =
      String(input.title ?? "").trim() ||
      `Resumo operacional - ${new Intl.DateTimeFormat("pt-BR").format(new Date())}`;
    const type = String(input.type ?? "monthly_operational_summary");
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
      db.select({ value: count() }).from(shiftLogEntries).where(eq(shiftLogEntries.isPending, true)),
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
      .values({ title, type, payload })
      .returning({
        id: reports.id,
        title: reports.title,
        type: reports.type,
      });

    return {
      success: true,
      data: report,
      events: [
        {
          eventType: "report.generated",
          entityType: "report",
          entityId: report.id,
          payload: report,
        },
      ],
    };
  },
};
