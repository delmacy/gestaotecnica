export type DraftLoadEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { type: "not_found"; message: string } }
  | { ok: false; error: { type: "forbidden"; message: string } }
  | { ok: false; error: { type: "invalid_state"; message: string } };
