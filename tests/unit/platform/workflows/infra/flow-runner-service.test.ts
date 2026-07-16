import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { instantiateFromPublication } from "@/platform/workflows/infra/flow-runner-service";
import { PublicationResultEnvelope } from "@/platform/workflows/contracts";
import { randomUUID } from "node:crypto";

describe("Flow Runner Service - instantiateFromPublication", () => {
  const workspaceId = randomUUID();
  const processDefinitionId = randomUUID();
  const processVersionId = randomUUID();
  const actorId = randomUUID();

  it("should instantiate a ProcessInstance and TimelineItem from a successful publication", () => {
    const publication: PublicationResultEnvelope = {
      ok: true,
      data: {
        processDefinitionId,
        processVersionId,
        status: "published",
        publishedAt: new Date().toISOString(),
      },
    };

    const { instance, timeline } = instantiateFromPublication(publication, workspaceId, actorId);

    assert.equal(instance.workspaceId, workspaceId);
    assert.equal(instance.processVersionId, processVersionId);
    assert.equal(instance.status, "active");
    assert.equal(instance.createdById, actorId);
    assert.ok(instance.id);
    assert.ok(instance.createdAt);

    assert.equal(timeline.type, "process_instance_created");
    assert.equal(timeline.actorId, actorId);
    assert.equal(timeline.payload.instanceId, instance.id);
    assert.equal(timeline.payload.processDefinitionId, processDefinitionId);
    assert.equal(timeline.payload.processVersionId, processVersionId);
    assert.ok(timeline.id);
    assert.ok(timeline.occurredAt instanceof Date);
  });

  it("should throw an error if publication is failed", () => {
    const publication: PublicationResultEnvelope = {
      ok: false,
      error: {
        code: "TEST_ERROR",
        message: "Test error message",
      },
    };

    assert.throws(() => instantiateFromPublication(publication, workspaceId), /Cannot instantiate from failed publication/);
  });
});
