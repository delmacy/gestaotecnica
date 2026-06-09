import { describe, it } from "node:test";
import assert from "node:assert";
import { getAgentWorkDb, closeAgentWorkDb } from "../../src/agent-work/db";

describe("Agent Work Board Integration Tests", () => {
    it("should initialize database connection without throwing if environment is test or env var exists", async () => {
        try {
            const db = getAgentWorkDb();
            assert.ok(db, "DB instance should exist");
            await closeAgentWorkDb();
        } catch (err: any) {
             assert.fail(`Should not throw in test env: ${err.message}`);
        }
    });
});
