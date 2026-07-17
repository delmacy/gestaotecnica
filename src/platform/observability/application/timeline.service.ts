import { TimelineItem } from "@/platform/observability/contracts/timeline-item";
import { TimelinePersistencePort } from "../persistence/ports/timeline-persistence.port";
import { TimelineRepository } from "../persistence/repositories/timeline-repository";

export class TimelineService {
  constructor(private readonly repository: TimelinePersistencePort = new TimelineRepository()) {}

  async getWorkspaceTimeline(workspaceId: string, limit = 20): Promise<TimelineItem[]> {
    return this.repository.getWorkspaceTimeline(workspaceId, limit);
  }

  async getProcessInstanceTimeline(workspaceId: string, instanceId: string): Promise<TimelineItem[]> {
    return this.repository.getProcessInstanceTimeline(workspaceId, instanceId);
  }
}
