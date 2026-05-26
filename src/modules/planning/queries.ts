import { desc, eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  serviceOrderAssignments,
  serviceOrders,
  technicianProfiles,
  timeEntries,
  users,
  workItems,
} from "@/db/schema";

export async function getPlanningBoard() {
  const db = getDb();

  const [backlog, plannedOrders, executionOrders, reviewOrders] = await Promise.all([
    db
      .select({
        id: workItems.id,
        title: workItems.title,
        type: workItems.type,
        status: workItems.status,
        priority: workItems.priority,
        createdAt: workItems.createdAt,
        assetCode: assets.code,
        assetName: assets.name,
      })
      .from(workItems)
      .leftJoin(assets, eq(workItems.assetId, assets.id))
      .where(inArray(workItems.status, ["open", "triaged", "planned", "blocked"]))
      .orderBy(desc(workItems.createdAt))
      .limit(12),
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
        status: serviceOrders.status,
        priority: serviceOrders.priority,
        createdAt: serviceOrders.createdAt,
        assetCode: assets.code,
        assetName: assets.name,
      })
      .from(serviceOrders)
      .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
      .where(inArray(serviceOrders.status, ["open", "assigned"]))
      .orderBy(desc(serviceOrders.createdAt))
      .limit(12),
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
        status: serviceOrders.status,
        priority: serviceOrders.priority,
        createdAt: serviceOrders.createdAt,
        assetCode: assets.code,
        assetName: assets.name,
      })
      .from(serviceOrders)
      .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
      .where(eq(serviceOrders.status, "in_progress"))
      .orderBy(desc(serviceOrders.createdAt))
      .limit(12),
    db
      .select({
        id: serviceOrders.id,
        code: serviceOrders.code,
        title: serviceOrders.title,
        status: serviceOrders.status,
        priority: serviceOrders.priority,
        createdAt: serviceOrders.createdAt,
        assetCode: assets.code,
        assetName: assets.name,
      })
      .from(serviceOrders)
      .leftJoin(assets, eq(serviceOrders.assetId, assets.id))
      .where(inArray(serviceOrders.status, ["waiting_review", "completed"]))
      .orderBy(desc(serviceOrders.createdAt))
      .limit(12),
  ]);

  return {
    backlog,
    executionOrders,
    plannedOrders,
    reviewOrders,
  };
}

export async function getPlanningTechnicianLoad() {
  const db = getDb();

  return db
    .select({
      technicianProfileId: technicianProfiles.id,
      technicianName: users.name,
      technicianEmail: users.email,
      level: technicianProfiles.level,
      activeAssignments: sql<number>`count(distinct ${serviceOrderAssignments.id}) filter (where ${serviceOrderAssignments.releasedAt} is null)`,
      minutes: sql<number>`coalesce(sum(${timeEntries.durationMinutes}), 0)`,
    })
    .from(technicianProfiles)
    .innerJoin(users, eq(technicianProfiles.userId, users.id))
    .leftJoin(
      serviceOrderAssignments,
      eq(serviceOrderAssignments.technicianProfileId, technicianProfiles.id),
    )
    .leftJoin(timeEntries, eq(timeEntries.technicianProfileId, technicianProfiles.id))
    .groupBy(technicianProfiles.id, users.name, users.email)
    .orderBy(desc(sql`count(distinct ${serviceOrderAssignments.id}) filter (where ${serviceOrderAssignments.releasedAt} is null)`))
    .limit(20);
}
