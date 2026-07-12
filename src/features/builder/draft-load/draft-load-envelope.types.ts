import type { BuilderValidationIssue } from "@/features/builder/types";

export type DraftLoadEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: "not_found" } }
  | { ok: false; error: { type: "forbidden" } }
  | { ok: false; error: { type: "invalid"; errors: BuilderValidationIssue[] } };
