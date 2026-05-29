import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as legacySchema from "./legacy/schema";
import * as registrySchema from "./platform/schema/registry";
import * as blueprintsSchema from "./platform/schema/blueprints";
import * as workflowSchema from "./runtime/schema/workflow";
import * as workspaceSchema from "./runtime/schema/workspace";
import * as identitySchema from "./runtime/schema/identity";

const fullSchema = {
  ...legacySchema,
  ...registrySchema,
  ...blueprintsSchema,
  ...workflowSchema,
  ...workspaceSchema,
  ...identitySchema,
};

let platformClient: postgres.Sql | null = null;
let runtimeClient: postgres.Sql | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let platformDbInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let runtimeDbInstance: any = null;

export function getPlatformDb() {
  if (!platformDbInstance) {
    const databaseUrl = process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("PLATFORM_DATABASE_URL or DATABASE_URL is required.");
    }

    platformClient = postgres(databaseUrl, {
      max: 5,
      prepare: false,
    });

    platformDbInstance = drizzle(platformClient, { schema: fullSchema });
  }

  return platformDbInstance;
}

export function getRuntimeDb() {
  if (!runtimeDbInstance) {
    const databaseUrl = process.env.RUNTIME_DATABASE_URL || process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("RUNTIME_DATABASE_URL or DATABASE_URL is required.");
    }

    runtimeClient = postgres(databaseUrl, {
      max: 10,
      prepare: false,
    });

    runtimeDbInstance = drizzle(runtimeClient, { schema: fullSchema });
  }

  return runtimeDbInstance;
}

// Backward compatibility
export function getDb() {
  return getRuntimeDb();
}

export const platformDb = getPlatformDb();
export const runtimeDb = getRuntimeDb();
export type DbClient = ReturnType<typeof getRuntimeDb>;
