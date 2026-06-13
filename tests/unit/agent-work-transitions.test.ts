import { describe, it } from "node:test";
import assert from "node:assert";

describe("Agent Work Domain Logic", () => {
    it("should correctly identify overlapping paths", () => {
        const { validateOwnership, classifyCollision } = require("../../src/agent-work/services/collision-engine");

        const pkg1 = {
            ownedPaths: ["src/platform/**"],
            forbiddenPaths: ["src/modules/**"]
        };

        assert.strictEqual(validateOwnership(pkg1 as any), true);

        const pkg2 = {
            ownedPaths: ["src/platform/**"],
            forbiddenPaths: ["src/platform/contracts/**"]
        };
        assert.strictEqual(validateOwnership(pkg2 as any), false);

        const pkg3 = {
            ownedPaths: ["src/platform/api/**"]
        };

        assert.strictEqual(classifyCollision(pkg1 as any, pkg3 as any), "red");
    });
});
