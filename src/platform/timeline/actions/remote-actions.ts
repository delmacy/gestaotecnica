"use server";

import { TimelineService } from "../application/timeline.service";
import { TimelineEntry } from "@/components/builder/timeline/platform-timeline";

export async function getLiveTimelineEntries(workspaceId: string): Promise<TimelineEntry[]> {
  const service = new TimelineService();
  let items = [];
  try {
    items = await service.getWorkspaceTimeline(workspaceId);
  } catch (e) {
    console.error("Failed to fetch timeline:", e);
    return [];
  }

  return items.map(item => ({
    id: item.id,
    type: item.type as any,
    title: item.title,
    timestamp: item.occurredAt.toLocaleTimeString("pt-BR"),
    payload: item.payload
  }));
}
