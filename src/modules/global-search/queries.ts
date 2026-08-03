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
import type { GlobalSearchDTO, SearchResultItem } from "./contracts/search-dto";

function pattern(query: string) {
  return `%${query.trim()}%`;
}

export async function searchEverything(query: string): Promise<GlobalSearchDTO> {
  const term = query.trim();
  if (term.length < 2) {
    return { state: "empty", message: "Digite pelo menos 2 caracteres." };
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

  const workItemsResult: SearchResultItem[] = workItemRows.map((item: { id: string; title: string; status: string; priority: string }) => ({
    id: item.id,
    title: item.title,
    subtitle: `${item.status} — ${item.priority}`,
    type: "demandas",
    url: `/work-items/${item.id}`,
  }));

  const serviceOrdersResult: SearchResultItem[] = serviceOrderRows.map((order: { id: string; title: string; code: string; status: string }) => ({
    id: order.id,
    title: order.title,
    subtitle: `${order.code} — ${order.status}`,
    type: "os",
    url: `/service-orders/${order.id}`,
  }));

  const assetsResult: SearchResultItem[] = assetRows.map((asset: { id: string; name: string; code: string; type: string }) => ({
    id: asset.id,
    title: asset.name,
    subtitle: `${asset.code} — ${asset.type}`,
    type: "ativos",
    url: `/assets/${asset.id}`,
  }));

  const techniciansResult: SearchResultItem[] = technicianRows.map((tech: { id: string; name: string; email: string; specialty: string | null }) => ({
    id: tech.id,
    title: tech.name,
    subtitle: `${tech.email} — ${tech.specialty ?? "Sem especialidade"}`,
    type: "tecnicos",
    url: "",
  }));

  const hasResults =
    workItemsResult.length > 0 ||
    serviceOrdersResult.length > 0 ||
    assetsResult.length > 0 ||
    techniciansResult.length > 0;

  if (!hasResults) {
    return { state: "empty", message: "Nenhum resultado encontrado." };
  }

  return {
    state: "real",
    data: {
      workItems: workItemsResult,
      serviceOrders: serviceOrdersResult,
      assets: assetsResult,
      technicians: techniciansResult,
    },
  };
}
