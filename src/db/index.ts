import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as legacySchema from "./legacy/schema";
import * as registrySchema from "./platform/schema/registry";
import * as blueprintsSchema from "./platform/schema/blueprints";
import * as candidatesSchema from "./platform/schema/candidates";
import * as workflowSchema from "./runtime/schema/workflow";
import * as workspaceSchema from "./runtime/schema/workspace";
import * as identitySchema from "./runtime/schema/identity";
import * as notificationsSchema from "./runtime/schema/notifications";
import * as storageSchema from "./runtime/schema/storage";
import * as documentsSchema from "./runtime/schema/documents";
import * as traceabilitySchema from "./runtime/schema/traceability";

const fullSchema = {
  ...legacySchema,
  ...registrySchema,
  ...blueprintsSchema,
  ...candidatesSchema,
  ...workflowSchema,
  ...workspaceSchema,
  ...identitySchema,
  ...notificationsSchema,
  ...storageSchema,
  ...documentsSchema,
  ...traceabilitySchema,
};

let platformClient: postgres.Sql | null = null;
let runtimeClient: postgres.Sql | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let platformDbInstance: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let runtimeDbInstance: any = null;

function getIsolatedTestDatabaseUrl() {
  return process.env.AGENT_WORK_TEST_DATABASE_URL;
}

export function getPlatformDb() {
  if (!platformDbInstance) {
    const databaseUrl = process.env.PLATFORM_DATABASE_URL || process.env.DATABASE_URL || getIsolatedTestDatabaseUrl();

    if (!databaseUrl) {
      throw new Error("PLATFORM_DATABASE_URL, DATABASE_URL, or isolated test database URL is required.");
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
    const databaseUrl = process.env.RUNTIME_DATABASE_URL || process.env.DATABASE_URL || getIsolatedTestDatabaseUrl();

    if (!databaseUrl) {
      throw new Error("RUNTIME_DATABASE_URL, DATABASE_URL, or isolated test database URL is required.");
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

export async function closeDatabaseConnections() {
  await Promise.all([
    platformClient?.end({ timeout: 5 }),
    runtimeClient?.end({ timeout: 5 }),
  ]);
  platformClient = null;
  runtimeClient = null;
  platformDbInstance = null;
  runtimeDbInstance = null;
}

export const platformDb = getPlatformDb();
export const runtimeDb = getRuntimeDb();
export type DbClient = ReturnType<typeof getRuntimeDb>;
