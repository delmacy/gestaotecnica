import { test, describe } from "node:test";
import * as assert from "node:assert/strict";
import { checkDraftToPublishedBoundary } from "../../src/features/builder/candidates/boundary/draft-to-published-boundary";

describe("checkDraftToPublishedBoundary", () => {
    test("validates draft to published transition", () => {
        const result = checkDraftToPublishedBoundary("draft", "published");
        assert.strictEqual(result.isTransition, true);
        assert.strictEqual(result.reason, undefined);
    });

    test("invalidates published to draft transition", () => {
        const result = checkDraftToPublishedBoundary("published", "draft");
        assert.strictEqual(result.isTransition, false);
        assert.strictEqual(result.reason, "Invalid transition from published to draft");
    });
});
