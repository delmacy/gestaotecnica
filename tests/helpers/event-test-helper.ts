import { randomUUID } from "node:crypto";
import { getRuntimeDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";

/**
 * Helper to create a test workspace using the runtime schema.
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
    status: "active",
  });

  return { id, key };
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
    enabledModules: ["events"],
    scopes: ["*"],
    correlationId: `test-corr-${randomUUID()}`,
  };
}
