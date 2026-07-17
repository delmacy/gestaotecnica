import test from "node:test";
import assert from "node:assert";
import { InMemoryTimelineRepository } from "../../../../../../src/platform/observability/persistence/repositories/in-memory-timeline.repository";
import { TimelineItem } from "../../../../../../src/platform/observability/contracts/timeline-item";

test("InMemoryTimelineRepository - should maintain workspace timeline isolation", async () => {
  const repo = new InMemoryTimelineRepository();

  const item1: TimelineItem = {
    id: "evt-1",
    type: "system",
    title: "Test Event 1",
    occurredAt: new Date("2024-01-01T10:00:00Z"),
    payload: { workspaceId: "ws-1" }
  };
  const item2: TimelineItem = {
    id: "evt-2",
    type: "system",
    title: "Test Event 2",
    occurredAt: new Date("2024-01-01T11:00:00Z"),
    payload: { workspaceId: "ws-2" }
  };

  await repo.save(item1);
  await repo.save(item2);

  const timeline = await repo.getWorkspaceTimeline("ws-1");
  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].id, "evt-1");
});

test("InMemoryTimelineRepository - should get process instance timeline with workspace isolation", async () => {
  const repo = new InMemoryTimelineRepository();

  const item1: TimelineItem = {
    id: "evt-1",
    type: "system",
    title: "Test Event 1",
    occurredAt: new Date("2024-01-01T10:00:00Z"),
    payload: { instanceId: "inst-1", workspaceId: "ws-1" }
  };
  const item2: TimelineItem = {
    id: "evt-2",
    type: "system",
    title: "Test Event 2",
    occurredAt: new Date("2024-01-01T11:00:00Z"),
    payload: { instanceId: "inst-1", workspaceId: "ws-2" }
  };

  await repo.save(item1);
  await repo.save(item2);

  const timeline = await repo.getProcessInstanceTimeline("ws-1", "inst-1");
  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].id, "evt-1");
});
