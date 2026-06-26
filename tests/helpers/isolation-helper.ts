import { randomUUID } from "node:crypto";
import proxyquire from "proxyquire";
import { getRuntimeDb } from "@/db";
import { legacyWorkspaces as workspaces } from "@/db/schema";
import { workspaceModuleConfigs } from "@/db/schema";
import { users } from "@/db/schema";

/**
 * Helper to create a test workspace using the legacy schema in public.
 * Used to bypass EXECUTION_BLOCKED on setup.
 */
export async function createTestWorkspace(keySuffix: string) {
  const db = getRuntimeDb();
  const id = randomUUID();
  const key = `test-ws-${keySuffix}-${randomUUID().slice(0, 8)}`;

  await db.insert(workspaces).values({
    id,
    key,
    name: `Test Workspace ${keySuffix}`,
    adaptationKey: "secao-tecnica",
    isActive: true,
  });

  // Enable common modules
  const modules = [
    "work-intake", "reports", "assets", "work-items",
    "approvals", "workforce", "workflow-engine", "events"
  ];

  for (const moduleKey of modules) {
    await db.insert(workspaceModuleConfigs).values({
      workspaceId: id,
      moduleKey,
      name: moduleKey,
      isEnabled: true,
    });
  }

  return { id, key };
}

export async function createTestUser(emailSuffix: string) {
  const db = getRuntimeDb();
  const id = randomUUID();
  const email = `user-${emailSuffix}-${randomUUID().slice(0, 8)}@test.com`;

  await db.insert(users).values({
    id,
    name: `Test User ${emailSuffix}`,
    email,
    status: "active",
    accessProfile: "operador",
  });

  return { id, email };
}

export function mockWorkspaceContext(modulePath: string, context: any) {
  return proxyquire(modulePath, {
    "@/platform/workspace": {
      resolveWorkspaceContext: async () => context,
      "@global": true
    },
  });
}

export function createMockContext(workspace: { id: string, key: string }, user?: { id: string, name: string }) {
  return {
    workspaceId: workspace.id,
    workspaceKey: workspace.key,
    adaptationKey: "secao-tecnica",
    actor: {
      type: "user",
      id: user?.id ?? randomUUID(),
      name: user?.name ?? "Test User",
    },
    source: "ui",
    enabledModules: [
      "work-intake", "reports", "assets", "work-items",
      "approvals", "workforce", "workflow-engine", "events"
    ],
    scopes: ["*"],
    correlationId: `test-corr-${randomUUID()}`,
  };
}

/**
 * Diagnostic tool to check if a table exists in the database.
 */
export async function checkTableExists(schemaName: string, tableName: string): Promise<boolean> {
  const db = getRuntimeDb();
  try {
    const res = await (db as any).session.client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = ${schemaName}
        AND table_name = ${tableName}
      );
    `;
    return res[0].exists;
  } catch (e) {
    return false;
  }
}
