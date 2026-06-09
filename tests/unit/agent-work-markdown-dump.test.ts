import { describe, it } from "node:test";
import assert from "node:assert";

describe("Agent Work Markdown Dump Service", () => {
    it("should export dumpMarkdown function", async () => {
        const { dumpMarkdown } = await import("../../src/agent-work/services/markdown-dump");
        assert.strictEqual(typeof dumpMarkdown, "function");
    });
});
