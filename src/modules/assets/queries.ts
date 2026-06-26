import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { assets, assetHistory } from "@/db/runtime/schema/assets";
import { resolveWorkspaceContext } from "@/platform/workspace";

export async function getAssets() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const { workspaceId } = context;

  if (!workspaceId) return [];

  const db = getDb();
  return db
    .select()
    .from(assets)
    .where(eq(assets.workspaceId, workspaceId))
    .orderBy(desc(assets.createdAt));
}

export async function getAssetById(id: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const { workspaceId } = context;

  if (!workspaceId) return null;

  const db = getDb();
  const [asset] = await db
    .select()
    .from(assets)
    .where(and(eq(assets.id, id), eq(assets.workspaceId, workspaceId)))
    .limit(1);

  return asset ?? null;
}

export async function getAssetHistory(assetId: string) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const { workspaceId } = context;

  if (!workspaceId) return [];

  const db = getDb();
  return db
    .select()
    .from(assetHistory)
    .where(
      and(
        eq(assetHistory.assetId, assetId),
        eq(assetHistory.workspaceId, workspaceId),
      ),
    )
    .orderBy(desc(assetHistory.occurredAt));
}

// Aliases for backward compatibility
export async function getAssetOptions() {
  const assetsList = await getAssets();
  return assetsList.map((a: any) => ({ id: a.id, code: a.code, name: a.name, status: a.status }));
}

export async function getAssetTypeOptions() {
  return [
    { value: "equipment", label: "Equipamento" },
    { value: "vehicle", label: "Veículo" },
    { value: "tool", label: "Ferramenta" },
  ];
}

export async function getAssetSummary() {
  const assetsList = await getAssets();
  return [
    { label: "Total de Ativos", value: assetsList.length },
    { label: "Ativos Disponíveis", value: assetsList.filter((a: any) => a.status === 'available').length },
    { label: "Em Manutenção", value: assetsList.filter((a: any) => a.status === 'maintenance').length },
    { label: "Avariados", value: assetsList.filter((a: any) => a.status === 'broken').length },
  ];
}

export async function getAssetEvents(id: string) {
  return getAssetHistory(id);
}

export async function getAssetRelationsSummary(_id: string) {
  return [];
}
