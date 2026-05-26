import { desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db";
import {
  assets,
  serviceOrders,
  teams,
  technicianProfiles,
  users,
  workItems,
} from "@/db/schema";

function pattern(query: string) {
  return `%${query.trim()}%`;
}

export async function searchEverything(query: string) {
  const term = query.trim();
  if (term.length < 2) {
    return {
      assets: [],
      serviceOrders: [],
      technicians: [],
      workItems: [],
    };
  }

  const db = getDb();
  const like = pattern(term);

  const [workItemRows, serviceOrderRows, assetRows, technicianRows] =
    await Promise.all([
      db
        .select({
          id: workItems.id,
          title: workItems.title,
          description: workItems.description,
          status: workItems.status,
          priority: workItems.priority,
          createdAt: workItems.createdAt,
        })
        .from(workItems)
        .where(
          or(
            ilike(workItems.title, like),
            ilike(workItems.description, like),
            ilike(workItems.requesterName, like),
          ),
        )
        .orderBy(desc(workItems.createdAt))
        .limit(20),
      db
        .select({
          id: serviceOrders.id,
          code: serviceOrders.code,
          title: serviceOrders.title,
          objective: serviceOrders.objective,
          status: serviceOrders.status,
          priority: serviceOrders.priority,
          createdAt: serviceOrders.createdAt,
        })
        .from(serviceOrders)
        .where(
          or(
            ilike(serviceOrders.code, like),
            ilike(serviceOrders.title, like),
            ilike(serviceOrders.objective, like),
          ),
        )
        .orderBy(desc(serviceOrders.createdAt))
        .limit(20),
      db
        .select({
          id: assets.id,
          code: assets.code,
          name: assets.name,
          type: assets.type,
          status: assets.status,
          location: assets.location,
          createdAt: assets.createdAt,
        })
        .from(assets)
        .where(
          or(
            ilike(assets.code, like),
            ilike(assets.name, like),
            ilike(assets.type, like),
            ilike(assets.location, like),
          ),
        )
        .orderBy(desc(assets.createdAt))
        .limit(20),
      db
        .select({
          id: technicianProfiles.id,
          name: users.name,
          email: users.email,
          level: technicianProfiles.level,
          specialty: technicianProfiles.specialty,
          teamName: teams.name,
          createdAt: technicianProfiles.createdAt,
        })
        .from(technicianProfiles)
        .innerJoin(users, eq(technicianProfiles.userId, users.id))
        .leftJoin(teams, eq(technicianProfiles.teamId, teams.id))
        .where(
          or(
            ilike(users.name, like),
            ilike(users.email, like),
            ilike(technicianProfiles.specialty, like),
          ),
        )
        .orderBy(desc(technicianProfiles.createdAt))
        .limit(20),
    ]);

  return {
    assets: assetRows,
    serviceOrders: serviceOrderRows,
    technicians: technicianRows,
    workItems: workItemRows,
  };
}
