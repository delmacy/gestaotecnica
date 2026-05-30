import { platformDb } from "@/db";
import { blueprints, blueprintVersions } from "@/db/platform/schema/blueprints";
import { registrySchema, modules, capabilities } from "@/db/platform/schema/registry";
import yaml from "js-yaml";
import { eq } from "drizzle-orm";

export class BlueprintLoaderService {
  async loadFromYaml(content: string) {
    const data = yaml.load(content) as any;
    const bpData = data.blueprint;

    // 1. Upsert Blueprint
    const [existing] = await platformDb
      .select()
      .from(blueprints)
      .where(eq(blueprints.key, bpData.key));

    let blueprintId: string;

    if (existing) {
      blueprintId = existing.id;
    } else {
      const [inserted] = await platformDb.insert(blueprints).values({
        key: bpData.key,
        name: bpData.name,
        description: bpData.description,
      }).returning();
      blueprintId = inserted.id;
    }

    // 2. Create Version
    await platformDb.insert(blueprintVersions).values({
      blueprintId,
      version: bpData.version,
      definition: data,
    });

    // 3. (Optional) Sync Capabilities from blueprint
    if (data.capabilities) {
      for (const cap of data.capabilities) {
        await platformDb.insert(capabilities).values({
          key: cap.key,
          name: cap.name,
        }).onConflictDoNothing();
      }
    }

    return blueprintId;
  }
}
