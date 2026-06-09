import { describe, it } from "node:test";
import assert from "node:assert";

describe("Agent Work Markdown Import Service", () => {
    it("should export importMarkdown function", async () => {
        const { importMarkdown } = await import("../../src/agent-work/services/markdown-import");
        assert.strictEqual(typeof importMarkdown, "function");
    });
});
