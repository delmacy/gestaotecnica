import { getPlatformDb } from "@/db";
import { capabilities } from "@/db/platform/schema/registry";
import { sql } from "drizzle-orm";

export async function getCapabilityCatalog() {
  try {
    const db = getPlatformDb();
    return await db.select().from(capabilities).orderBy(capabilities.name);
  } catch (e) {
    console.error("Failed to fetch capabilities from DB, falling back to empty list", e);
    return [];
  }
}

export async function upsertCapabilities(caps: { key: string, name: string, description?: string, isActive?: boolean }[]) {
  try {
    const db = getPlatformDb();
    const result = await db.insert(capabilities).values(caps).onConflictDoUpdate({
      target: capabilities.key,
      set: {
        name: sql`excluded.name`,
        description: sql`excluded.description`,
        isActive: sql`COALESCE(excluded.is_active, true)`,
        updatedAt: new Date()
      }
    }).returning();
    return result;
  } catch (e) {
    console.error("Failed to upsert capabilities", e);
    throw e;
  }
}
