import { TimelineItem } from "@/platform/observability/contracts/timeline-item";

export const validTimelineItem: TimelineItem = {
  id: "test-id",
  type: "system",
  title: "Test Event",
  description: "Optional description",
  occurredAt: new Date("2024-01-01T00:00:00Z"),
  actorId: "user-123",
  payload: { key: "value" }
};

export const validMinimalTimelineItem: TimelineItem = {
  id: "minimal-id",
  type: "audit",
  title: "Minimal Event",
  occurredAt: new Date("2024-01-01T00:00:00Z"),
  payload: {}
};
