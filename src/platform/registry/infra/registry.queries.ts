import { getPlatformDb } from "@/db";
import { capabilities } from "@/db/platform/schema/registry";

export async function getCapabilityCatalog() {
  try {
    const db = getPlatformDb();
    return await db.select().from(capabilities).orderBy(capabilities.name);
  } catch (e) {
    console.error("Failed to fetch capabilities from DB, falling back to empty list", e);
    return [];
  }
}
