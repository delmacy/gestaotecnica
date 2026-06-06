"use server";

import { getRuntimeDb } from "@/db";
import { getTimelineForInstance } from "./events.server";

export async function getTimelineForInstanceAction(instanceId: string) {
  try {
    // Mock tenant context as per project convention for MVP execution blocks
    const workspaceId = "00000000-0000-0000-0000-000000000000";

    const db = getRuntimeDb();

    const events = await getTimelineForInstance(db as any, workspaceId, instanceId);

    return {
      ok: true,
      data: events
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch timeline for instance",
      }
    };
  }
}
