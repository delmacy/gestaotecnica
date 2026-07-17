import { TimelineItem } from "@/platform/observability/contracts/timeline-item";

export interface TimelinePersistencePort {
  getWorkspaceTimeline(workspaceId: string, limit?: number): Promise<TimelineItem[]>;
  getProcessInstanceTimeline(workspaceId: string, instanceId: string): Promise<TimelineItem[]>;
}
