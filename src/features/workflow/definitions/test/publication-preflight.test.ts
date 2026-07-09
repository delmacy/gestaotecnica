import { test } from "node:test";
import * as assert from "node:assert/strict";
import { preflightPublication } from "../process-definition-publication.preflight";
import { createSampleBuilderDraft } from "../process-definition.fixtures";
import type { BuilderDraft } from "@/features/builder/types";

test("preflightPublication validates sample fixture", () => {
  const draft = createSampleBuilderDraft();
  const result = preflightPublication(draft);

  assert.equal(result.valid, true);
  assert.equal(result.issues.length, 0);
});

test("preflightPublication fails an invalid draft", () => {
  const draft = createSampleBuilderDraft();
  draft.nodes = []; // This triggers EMPTY_DRAFT which is a warning, wait, I need to trigger an error
  const invalidDraft: BuilderDraft = {
    ...draft,
    name: "", // Missing name triggers an error
  };

  const result = preflightPublication(invalidDraft);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "DRAFT_NAME_REQUIRED"));
});


test("preflightPublication fails an invalid draft with missing action reference", () => {
  const draft = createSampleBuilderDraft();
  draft.nodes.push({
    id: "node-integration",
    type: "integration",
    label: "Integration Node",
    position: { x: 0, y: 0 },
    config: {},
  });

  const result = preflightPublication(draft);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "MISSING_ACTION_REFERENCE"));
});

test("preflightPublication fails an invalid draft with non-existent action reference", () => {
  const draft = createSampleBuilderDraft();
  draft.nodes.push({
    id: "node-integration",
    type: "integration",
    label: "Integration Node",
    position: { x: 0, y: 0 },
    config: {
      action: "non_existent_action"
    },
  });

  const result = preflightPublication(draft);

  assert.equal(result.valid, false);
  assert.ok(result.issues.some((i) => i.code === "INVALID_ACTION_REFERENCE"));
});
