import { test, describe } from "node:test";
import assert from "node:assert";
import { ApprovalActorSchema } from "../../src/platform/governance/contracts/approval-decision";
import {
  VALID_APPROVAL_PROVENANCE_ACTOR,
  INVALID_APPROVAL_PROVENANCE_ACTOR_MISSING_ID,
  INVALID_APPROVAL_PROVENANCE_ACTOR_UNKNOWN_TYPE
} from "../fixtures/platform/governance/approval-provenance.fixtures";

describe("Approval Provenance Fixtures", () => {
  test("should validate valid approval provenance actor", () => {
    const result = ApprovalActorSchema.parse(VALID_APPROVAL_PROVENANCE_ACTOR);
    assert.strictEqual(result.type, "user");
    assert.strictEqual(result.id, "user-123");
  });

  test("should reject missing id", () => {
    assert.throws(() => ApprovalActorSchema.parse(INVALID_APPROVAL_PROVENANCE_ACTOR_MISSING_ID));
  });

  test("should reject unknown type", () => {
    assert.throws(() => ApprovalActorSchema.parse(INVALID_APPROVAL_PROVENANCE_ACTOR_UNKNOWN_TYPE));
  });
});
