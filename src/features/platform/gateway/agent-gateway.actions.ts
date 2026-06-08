"use server";

import { getPlatformDb } from "@/db";
import { eq } from "drizzle-orm";
import { processCandidates } from "@/db/platform/schema";

export async function listAgentCandidatesAction() {
  try {
    const db = getPlatformDb();

    // We get only candidates that have origin = 'agent'
    const records = await db
      .select()
      .from(processCandidates)
      .where(eq(processCandidates.origin, "agent"))
      .orderBy(processCandidates.createdAt);

    return { ok: true, data: records };
  } catch (err: any) {
    return { ok: false, error: { code: "INTERNAL_ERROR", message: "Failed to list agent submissions" } };
  }
}
