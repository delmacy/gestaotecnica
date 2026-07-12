import { test } from "node:test";
import assert from "node:assert/strict";
import type { DraftDeleteEnvelope, DraftRollbackEnvelope } from "@/features/builder/draft-delete/draft-delete-envelope.types";

test("DraftDeleteEnvelope type narrowing and construction", async (t) => {
  await t.test("success variant narrows correctly", () => {
    const successResult: DraftDeleteEnvelope<{ id: string }> = {
      ok: true,
      data: { id: "123" },
    };

    if (successResult.ok) {
      assert.equal(successResult.data.id, "123");
    } else {
      assert.fail("Should have narrowed to success branch");
    }
  });

  await t.test("not_found variant narrows correctly", () => {
    const failureResult: DraftDeleteEnvelope<{ id: string }> = {
      ok: false,
      error: { type: "not_found" },
    };

    if (!failureResult.ok) {
      assert.equal(failureResult.error.type, "not_found");
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });

  await t.test("forbidden variant narrows correctly", () => {
    const failureResult: DraftDeleteEnvelope<{ id: string }> = {
      ok: false,
      error: { type: "forbidden" },
    };

    if (!failureResult.ok) {
      assert.equal(failureResult.error.type, "forbidden");
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });

  await t.test("published_draft_cannot_be_deleted variant narrows correctly", () => {
    const failureResult: DraftDeleteEnvelope<{ id: string }> = {
      ok: false,
      error: { type: "published_draft_cannot_be_deleted" },
    };

    if (!failureResult.ok) {
      assert.equal(failureResult.error.type, "published_draft_cannot_be_deleted");
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });
});

test("DraftRollbackEnvelope type narrowing and construction", async (t) => {
  await t.test("success variant narrows correctly", () => {
    const successResult: DraftRollbackEnvelope<{ id: string }> = {
      ok: true,
      data: { id: "123" },
    };

    if (successResult.ok) {
      assert.equal(successResult.data.id, "123");
    } else {
      assert.fail("Should have narrowed to success branch");
    }
  });

  await t.test("not_found variant narrows correctly", () => {
    const failureResult: DraftRollbackEnvelope<{ id: string }> = {
      ok: false,
      error: { type: "not_found" },
    };

    if (!failureResult.ok) {
      assert.equal(failureResult.error.type, "not_found");
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });

  await t.test("forbidden variant narrows correctly", () => {
    const failureResult: DraftRollbackEnvelope<{ id: string }> = {
      ok: false,
      error: { type: "forbidden" },
    };

    if (!failureResult.ok) {
      assert.equal(failureResult.error.type, "forbidden");
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });

  await t.test("no_previous_version variant narrows correctly", () => {
    const failureResult: DraftRollbackEnvelope<{ id: string }> = {
      ok: false,
      error: { type: "no_previous_version" },
    };

    if (!failureResult.ok) {
      assert.equal(failureResult.error.type, "no_previous_version");
    } else {
      assert.fail("Should have narrowed to failure branch");
    }
  });
});
