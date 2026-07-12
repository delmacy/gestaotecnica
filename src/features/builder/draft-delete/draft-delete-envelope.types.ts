export type DraftDeleteEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: "not_found" } }
  | { ok: false; error: { type: "forbidden" } }
  | { ok: false; error: { type: "published_draft_cannot_be_deleted" } };

export type DraftRollbackEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: "not_found" } }
  | { ok: false; error: { type: "forbidden" } }
  | { ok: false; error: { type: "no_previous_version" } };
