import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { OnboardingEvidenceSchema } from "../../../src/platform/onboarding/contracts/onboarding-evidence";
import { OnboardingService } from "../../../src/platform/onboarding/application/onboarding-service";

describe("OnboardingEvidenceSchema", () => {
  it("should validate a valid evidence payload", () => {
    const payload = {
      id: crypto.randomUUID(),
      userId: "user-123",
      stepCompleted: "step-1",
      timestamp: new Date().toISOString(),
    };
    assert.doesNotThrow(() => OnboardingEvidenceSchema.parse(payload));
  });

  it("should reject invalid evidence payloads", () => {
    const payload = {
      id: "not-a-uuid",
      userId: "user-123",
      stepCompleted: "step-1",
      timestamp: "not-a-date",
    };
    assert.throws(() => OnboardingEvidenceSchema.parse(payload));
  });
});

describe("OnboardingService", () => {
  it("should save evidence correctly", () => {
    const evidenceInput = {
      userId: "test-user",
      stepCompleted: "test-step",
    };

    const evidence = OnboardingService.saveEvidence(evidenceInput);

    assert.equal(evidence.userId, evidenceInput.userId);
    assert.equal(evidence.stepCompleted, evidenceInput.stepCompleted);
    assert.ok(evidence.id);
    assert.ok(evidence.timestamp);
  });
});
