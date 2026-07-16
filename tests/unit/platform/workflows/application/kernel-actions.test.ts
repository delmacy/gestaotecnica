import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { saveProcessDefinitionKernelAction } from "@/platform/workflows/application/kernel-actions";

describe("saveProcessDefinitionKernelAction", () => {
    it("is wired", () => {
        assert.ok(saveProcessDefinitionKernelAction.handler)
    })
})
