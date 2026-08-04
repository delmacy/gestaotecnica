import { sql } from "drizzle-orm";
import { getRuntimeDb } from "@/db";

export async function setSessionWorkspaceId(workspaceId: string): Promise<void> {
  const db = getRuntimeDb();
  await db.execute(sql`SELECT set_config('app.workspace_id', ${workspaceId}, true)`);
}
