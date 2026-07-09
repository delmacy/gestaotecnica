"use server";

import { getRuntimeDb } from "@/db";
import { getTimelineForInstance } from "./events.server";
import { getTimelineForInstanceInputSchema } from "./events.validation";
import type { EventDb } from "./events.repository";

export async function getTimelineForInstanceAction(instanceId: string) {
  try {
    // Mock tenant context as per project convention for MVP execution blocks
    const workspaceId = "00000000-0000-0000-0000-000000000000";

    const validationResult = getTimelineForInstanceInputSchema.safeParse({ workspaceId, instanceId });
    if (!validationResult.success) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid input provided",
          issues: validationResult.error.issues,
        }
      };
    }

    const db = getRuntimeDb() as unknown as EventDb;

    const events = await getTimelineForInstance(db, workspaceId, instanceId);

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
