import test from "node:test";
import assert from "node:assert";
import {
  agentProcessCandidatePayloadSchema,
  mapAgentPayloadToCandidateInput,
} from "@/features/platform/gateway/contracts";
import {
  mockValidCanonicalPayload,
  mockMinimalCanonicalPayload,
  mockInvalidPayloadMissingWorkspaceId,
  mockInvalidPayloadMissingJustification,
  mockInvalidPayloadConfidenceScore,
  mockInvalidPayloadTooManyStates,
} from "@/features/platform/gateway/mocks/agent-payload.mock";

test("Agent Payload Contract - Validation", async (t) => {
  await t.test("Accepts valid canonical payload", () => {
    const result = agentProcessCandidatePayloadSchema.safeParse(mockValidCanonicalPayload);
    assert.strictEqual(result.success, true);
  });

  await t.test("Accepts minimal valid canonical payload", () => {
    const result = agentProcessCandidatePayloadSchema.safeParse(mockMinimalCanonicalPayload);
    assert.strictEqual(result.success, true);
  });

  await t.test("Rejects missing workspaceId", () => {
    const result = agentProcessCandidatePayloadSchema.safeParse(mockInvalidPayloadMissingWorkspaceId);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("workspaceId")));
    }
  });

  await t.test("Rejects empty name", () => {
    const payload = { ...mockMinimalCanonicalPayload, name: "" };
    const result = agentProcessCandidatePayloadSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("name")));
    }
  });

  await t.test("Rejects empty justification", () => {
    const payload = {
      ...mockMinimalCanonicalPayload,
      proposal: { ...mockMinimalCanonicalPayload.proposal, justification: "" },
    };
    const result = agentProcessCandidatePayloadSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("justification")));
    }
  });

  await t.test("Rejects missing justification", () => {
    const result = agentProcessCandidatePayloadSchema.safeParse(mockInvalidPayloadMissingJustification);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("justification")));
    }
  });

  await t.test("Rejects out-of-range confidenceScore (> 1)", () => {
    const result = agentProcessCandidatePayloadSchema.safeParse(mockInvalidPayloadConfidenceScore);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("confidenceScore")));
    }
  });

  await t.test("Rejects out-of-range confidenceScore (< 0)", () => {
    const payload = {
      ...mockMinimalCanonicalPayload,
      proposal: { ...mockMinimalCanonicalPayload.proposal, confidenceScore: -0.5 },
    };
    const result = agentProcessCandidatePayloadSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("confidenceScore")));
    }
  });

  await t.test("Rejects suggestedForms with missing field keys", () => {
    const payload = {
      ...mockMinimalCanonicalPayload,
      proposal: {
        ...mockMinimalCanonicalPayload.proposal,
        suggestedForms: [
          {
            key: "form1",
            title: "Form 1",
            fields: [{ label: "Field", type: "text" }], // Missing key
          },
        ],
      },
    };
    const result = agentProcessCandidatePayloadSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("key")));
    }
  });

  await t.test("Rejects too many suggestedStates", () => {
    const result = agentProcessCandidatePayloadSchema.safeParse(mockInvalidPayloadTooManyStates);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("suggestedStates")));
    }
  });

  await t.test("Rejects too many fields in a form", () => {
    const payload = {
      ...mockMinimalCanonicalPayload,
      proposal: {
        ...mockMinimalCanonicalPayload.proposal,
        suggestedForms: [
          {
            key: "form1",
            title: "Form 1",
            fields: Array.from({ length: 85 }).map((_, i) => ({
              key: `f${i}`,
              label: `Field ${i}`,
              type: "text" as const,
            })),
          },
        ],
      },
    };
    const result = agentProcessCandidatePayloadSchema.safeParse(payload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((i) => i.path.includes("fields")));
    }
  });
});

test("Agent Payload Contract - Mapper", async (t) => {
  await t.test("Mapper generates Candidate input correctly from minimal payload", () => {
    const input = mapAgentPayloadToCandidateInput(mockMinimalCanonicalPayload);
    assert.strictEqual(input.workspaceId, mockMinimalCanonicalPayload.workspaceId);
    assert.strictEqual(input.name, mockMinimalCanonicalPayload.name);
    assert.strictEqual(input.description, "Justification: Requested by user via API.");
    assert.deepStrictEqual(input.proposedDefinition, {});
    assert.ok(input.evidence);

    // Type assertion to let TypeScript know we expect 'agent' property
    const evidenceObj = input.evidence as Record<string, any>;
    assert.strictEqual(evidenceObj.agent.source, "manual_api");
    assert.strictEqual(evidenceObj.agent.type, "unknown");
  });

  await t.test("Mapper generates Candidate input correctly from full payload", () => {
    const input = mapAgentPayloadToCandidateInput(mockValidCanonicalPayload);
    assert.strictEqual(input.workspaceId, mockValidCanonicalPayload.workspaceId);
    assert.strictEqual(input.name, mockValidCanonicalPayload.name);
    assert.ok(input.description?.includes(mockValidCanonicalPayload.description!));
    assert.ok(input.description?.includes(mockValidCanonicalPayload.proposal.justification));
    assert.deepStrictEqual(input.proposedDefinition, mockValidCanonicalPayload.proposal.proposedDefinition);

    const evidenceObj = input.evidence as Record<string, any>;
    assert.strictEqual(evidenceObj.agent.source, "n8n");
    assert.strictEqual(evidenceObj.agent.type, "observation_agent");
    assert.strictEqual(evidenceObj.agent.name, "HR Bot");
    assert.strictEqual(evidenceObj.proposal.confidenceScore, 0.95);
    assert.strictEqual(evidenceObj.proposal.suggestedStates.length, 2);
    assert.strictEqual(evidenceObj.proposal.suggestedForms.length, 1);
    assert.strictEqual(evidenceObj.summary, "Found 15 onboarding requests this month.");
    assert.strictEqual(evidenceObj.observedSignals.length, 1);
  });

  await t.test("Mapper doesn't allow payload to control status or origin", () => {
    const maliciousPayload = {
      ...mockMinimalCanonicalPayload,
      status: "published",
      origin: "human",
    } as any; // Cast as any to fake extra properties

    const input = mapAgentPayloadToCandidateInput(maliciousPayload);
    assert.strictEqual((input as any).status, undefined);
    assert.strictEqual((input as any).origin, undefined);
  });
});
