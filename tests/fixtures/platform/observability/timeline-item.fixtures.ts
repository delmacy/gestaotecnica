import { TimelineItem } from "@/platform/observability/contracts/timeline-item";

export const validTimelineItem: TimelineItem = {
  id: "item-123",
  type: "audit",
  title: "Processo Iniciado",
  description: "A process was started",
  occurredAt: new Date("2023-10-01T12:00:00Z"),
  actorId: "user-456",
  payload: { key: "value" },
};

export const validTimelineItemWithoutOptionals: TimelineItem = {
  id: "item-456",
  type: "system",
  title: "System Event",
  occurredAt: new Date("2023-10-02T12:00:00Z"),
  payload: {},
};
