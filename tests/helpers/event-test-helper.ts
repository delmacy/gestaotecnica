import { randomUUID } from "node:crypto";
import { getRuntimeDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";

/**
 * Creates a valid workspace for testing.
 */
export async function createTestWorkspace(name: string = "Test Workspace") {
  const db = getRuntimeDb();
  const id = randomUUID();
  await db.insert(workspaces).values({
    id,
    name,
    key: `test-${id.slice(0, 8)}`, // Use 'key' instead of 'slug'
  });
  return id;
}
