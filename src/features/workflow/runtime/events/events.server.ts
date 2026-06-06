import { getEventsByInstanceId } from "./events.repository";
import type { EventDb } from "./events.repository";
import type { EventRecord } from "./events.types";

export async function getTimelineForInstance(
  db: EventDb,
  workspaceId: string,
  instanceId: string
): Promise<EventRecord[]> {
  // Enforcing the blind/auth via workspaceId isolation directly down to the repository layer
  return await getEventsByInstanceId(db, workspaceId, instanceId);
}
