import test from "node:test";
import assert from "node:assert/strict";
import { generateDocumentKernelAction, transitionDocumentKernelAction } from "../../../../src/modules/documents/kernel-actions";

test("documents.generate validation", async () => {
  const context = { workspaceId: "123e4567-e89b-12d3-a456-426614174000" };

  // Missing title
  const result = await generateDocumentKernelAction.handler({ title: "" }, context as any);
  assert.equal(result.success, false);
  assert.equal(result.error?.code, "VALIDATION_ERROR");
});

test("documents.generate requires workspaceId", async () => {
  const context = { workspaceId: undefined };
  const result = await generateDocumentKernelAction.handler({ title: "Test Doc" }, context as any);
  assert.equal(result.success, false);
  assert.equal(result.error?.code, "UNAUTHORIZED");
});

test("documents.transition validation", async () => {
  const context = { workspaceId: "123e4567-e89b-12d3-a456-426614174000" };

  // Missing documentId
  const result = await transitionDocumentKernelAction.handler({ documentId: "", status: "approved" }, context as any);
  assert.equal(result.success, false);
  assert.equal(result.error?.code, "VALIDATION_ERROR");
});
