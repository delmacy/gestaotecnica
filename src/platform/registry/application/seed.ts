import { getPlatformDb } from "@/db";
import { capabilities } from "@/db/platform/schema/registry";
import { ecosystemModules } from "@/platform/workspaces/module-catalog";

export async function seedCapabilitiesFromEcosystem() {
  const db = getPlatformDb();

  console.log("Seeding capabilities from ecosystem catalog...");

  for (const mod of ecosystemModules) {
    await db
      .insert(capabilities)
      .values({
        key: mod.key,
        name: mod.name,
        description: mod.description,
      })
      .onConflictDoUpdate({
        target: capabilities.key,
        set: {
          name: mod.name,
          description: mod.description,
          updatedAt: new Date(),
        }
      });
  }

  console.log("Seeding complete.");
}
