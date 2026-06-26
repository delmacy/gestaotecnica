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
import { ensureActiveWorkspaceConfig } from "@/platform/workspaces/bootstrap";

export async function getOperationalReportData() {
  // REQUIREMENT: Strict workspace scoping.
  // Legacy tables lack workspace_id. Blocking data to prevent cross-tenant leaks.
  // Gap documented in docs/modules/reports-gaps.md

  return {
    cards: [
      { label: "Demandas", value: 0 },
      { label: "Ativos", value: 0 },
      { label: "Horas apontadas", value: 0 },
      { label: "Pendencias de turno", value: 0 },
    ],
    serviceOrders: [
      { label: "Abertas", value: 0 },
      { label: "Atribuidas", value: 0 },
      { label: "Em execucao", value: 0 },
      { label: "Em revisao", value: 0 },
      { label: "Concluidas", value: 0 },
      { label: "Aprovadas", value: 0 },
    ],
    recentOrders: [],
    blockedGaps: [
      "work_items",
      "assets",
      "time_entries",
      "shift_log_entries",
      "service_orders",
    ],
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
  // REQUIREMENT: Strict workspace scoping.
  // Legacy reports table lacks workspace_id.
  // Currently returning empty list to ensure isolation until schema is updated.
  return [];
}

export async function getReportTypeOptions() {
  return getWorkspaceReportTemplateOptions();
}
