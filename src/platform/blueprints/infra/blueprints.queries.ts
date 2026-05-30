import { eq, desc } from "drizzle-orm";
import { getPlatformDb } from "@/db";
import { blueprints, blueprintVersions } from "@/db/platform/schema/blueprints";

export async function getLatestBlueprint(key: string) {
  try {
    const db = getPlatformDb();

    const [blueprint] = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.key, key))
      .limit(1);

    if (!blueprint) return null;

    const [version] = await db
      .select()
      .from(blueprintVersions)
      .where(eq(blueprintVersions.blueprintId, blueprint.id))
      .orderBy(desc(blueprintVersions.createdAt))
      .limit(1);

    return version?.definition || null;
  } catch (e) {
    console.error("Failed to fetch latest blueprint", e);
    return null;
  }
}
