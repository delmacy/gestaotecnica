import { TimelineItem } from "@/platform/observability/contracts/timeline-item";
import { TimelinePersistencePort } from "../ports/timeline-persistence.port";

export class InMemoryTimelineRepository implements TimelinePersistencePort {
  private items: TimelineItem[] = [];

  async getWorkspaceTimeline(workspaceId: string, limit = 20): Promise<TimelineItem[]> {
    return this.items
      .filter((item) => {
          if (!item.payload) return false;
          const payloadObj = item.payload as Record<string, unknown>;
          return payloadObj.workspaceId === workspaceId;
      })
      .sort((a, b) => (b.occurredAt?.getTime() || 0) - (a.occurredAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getProcessInstanceTimeline(workspaceId: string, instanceId: string): Promise<TimelineItem[]> {
    return this.items
      .filter((item) => {
          if (!item.payload) return false;
          const payloadObj = item.payload as Record<string, unknown>;
          return payloadObj.instanceId === instanceId && payloadObj.workspaceId === workspaceId;
      })
      .sort((a, b) => (b.occurredAt?.getTime() || 0) - (a.occurredAt?.getTime() || 0));
  }

  async save(item: TimelineItem): Promise<void> {
    this.items.push(item);
  }
}
