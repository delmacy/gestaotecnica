import { count } from "drizzle-orm";
import type { AnyPgTable } from "drizzle-orm/pg-core";
import { getDb } from "@/db";
import {
  assets,
  eventLogs,
  serviceOrders,
  shiftLogEntries,
  shifts,
  teams,
  technicianProfiles,
  users,
  workItems,
} from "@/db/schema";

type DashboardMetric = {
  label: string;
  value: number;
};

export type DashboardSummary = {
  available: boolean;
  metrics: DashboardMetric[];
};

async function tableCount(table: AnyPgTable) {
  const db = getDb();
  const [row] = await db.select({ value: count() }).from(table);
  return row.value;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const [
      usersCount,
      teamsCount,
      technicianProfilesCount,
      assetsCount,
      workItemsCount,
      serviceOrdersCount,
      eventLogsCount,
      shiftsCount,
      shiftLogEntriesCount,
    ] = await Promise.all([
      tableCount(users),
      tableCount(teams),
      tableCount(technicianProfiles),
      tableCount(assets),
      tableCount(workItems),
      tableCount(serviceOrders),
      tableCount(eventLogs),
      tableCount(shifts),
      tableCount(shiftLogEntries),
    ]);

    return {
      available: true,
      metrics: [
        { label: "Usuarios", value: usersCount },
        { label: "Equipes", value: teamsCount },
        { label: "Responsavels", value: technicianProfilesCount },
        { label: "Ativos", value: assetsCount },
        { label: "Demandas", value: workItemsCount },
        { label: "execucao", value: serviceOrdersCount },
        { label: "Eventos", value: eventLogsCount },
        { label: "Turnos", value: shiftsCount },
        { label: "Registros de turno", value: shiftLogEntriesCount },
      ],
    };
  } catch {
    return {
      available: false,
      metrics: [],
    };
  }
}
