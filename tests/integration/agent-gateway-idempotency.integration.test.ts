import test from "node:test";
import assert from "node:assert";
import proxyquire from "proxyquire";
import { mockValidCanonicalPayload } from "@/features/platform/gateway/mocks/agent-payload.mock";

const memoryDb: Record<string, Record<string, unknown>[]> = {
  submissions: [],
  candidates: [],
};

const mockFindSubmission = async (idempotencyKey: string) => {
  return memoryDb.submissions.find(s => s.idempotencyKey === idempotencyKey) || null;
};

const mockCreateSubmission = async (data: Record<string, unknown>) => {
  const submission = { id: `sub-${Date.now()}`, ...data };
  memoryDb.submissions.push(submission);
  return submission;
};

const mockUpdateSubmission = async (id: string, data: Record<string, unknown>) => {
  const idx = memoryDb.submissions.findIndex(s => s.id === id);
  if (idx !== -1) {
    memoryDb.submissions[idx] = { ...memoryDb.submissions[idx], ...data };
  }
  return memoryDb.submissions[idx];
};

const { processAgentSubmissionWithMetadata } = proxyquire("@/features/platform/gateway/agent-gateway-metadata.service", {
  "@/features/platform/gateway/agent-gateway.repository": {
    findSubmissionByIdempotencyKey: mockFindSubmission,
    createSubmission: mockCreateSubmission,
    updateSubmissionStatus: mockUpdateSubmission,
  },
  "@/features/platform/gateway/agent-gateway.service": {
    submitCandidateFromAgent: async (input: Record<string, unknown>) => {
      const candidate = { id: `cand-${Date.now()}`, ...input, status: "draft" };
      memoryDb.candidates.push(candidate);
      return candidate;
    },
  },
});

test("Agent Gateway Idempotency Integration Tests", async (t) => {
  t.beforeEach(() => {
    memoryDb.submissions = [];
    memoryDb.candidates = [];
  });

  await t.test("Initial valid submission succeeds and creates candidate", async () => {
    const correlationId = `int-test-corr-1`;
    const idempotencyKey = `int-test-idem-1`;

    const result = await processAgentSubmissionWithMetadata(mockValidCanonicalPayload, {
      correlationId,
      idempotencyKey,
    });

    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.receipt.status, "success");
    assert.strictEqual(result.receipt.correlationId, correlationId);
    assert.strictEqual(result.receipt.idempotencyKey, idempotencyKey);
    assert.ok(result.data.id);

    // Verify candidate in DB
    const candidate = memoryDb.candidates.find(c => c.id === result.data.id);
    assert.ok(candidate);
    assert.strictEqual(candidate.name, mockValidCanonicalPayload.name);

    // Verify submission in DB
    const submission = memoryDb.submissions.find(s => s.correlationId === correlationId);
    assert.ok(submission);
    assert.strictEqual(submission.requestStatus, "success");
    assert.strictEqual(submission.candidateId, candidate.id);
  });

  await t.test("Duplicate submission with same idempotency key returns duplicate status and existing candidate", async () => {
    const correlationId2 = `int-test-corr-2`;
    const idempotencyKey = `int-test-idem-1`; // Reusing the key from the previous test

    // Ensure we count current candidates to guarantee no new one is created
    const candidatesBefore = memoryDb.candidates.length;

    const result = await processAgentSubmissionWithMetadata(mockValidCanonicalPayload, {
      correlationId: correlationId2,
      idempotencyKey,
    });

    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.receipt.status, "duplicate");
    // The correlation ID returned should be the original one associated with the idempotency key,
    // reflecting the original accepted submission.
    assert.strictEqual(result.receipt.correlationId, `int-test-corr-1`);
    assert.strictEqual(result.receipt.idempotencyKey, idempotencyKey);
    assert.ok(result.data.id); // Should return the ID of the original candidate

    // Verify no new candidate was created
    const candidatesAfter = memoryDb.candidates.length;
    assert.strictEqual(candidatesAfter, candidatesBefore);
  });

  await t.test("Invalid submission marks status as failed and doesn't create candidate", async () => {
    const correlationId = `int-test-corr-3`;
    const idempotencyKey = `int-test-idem-3`;
    const invalidPayload = { invalidField: true };

    const candidatesBefore = memoryDb.candidates.length;

    const result = await processAgentSubmissionWithMetadata(invalidPayload, {
      correlationId,
      idempotencyKey,
    });

    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.receipt.status, "failed");
    assert.strictEqual(result.receipt.correlationId, correlationId);
    assert.strictEqual(result.receipt.idempotencyKey, idempotencyKey);
    assert.strictEqual(result.error.code, "INVALID_PAYLOAD");

    // Verify no new candidate was created
    const candidatesAfter = memoryDb.candidates.length;
    assert.strictEqual(candidatesAfter, candidatesBefore);

    // Verify failed submission is in DB
    const submission = memoryDb.submissions.find(s => s.correlationId === correlationId);
    assert.ok(submission);
    assert.strictEqual(submission.requestStatus, "failed");
    assert.strictEqual(submission.errorCode, "INVALID_PAYLOAD");
  });
});
