import type { BuilderDraft, SerializedBuilderDraft } from "../types";

export function serializeBuilderDraft(draft: BuilderDraft): SerializedBuilderDraft {
  return {
    schemaVersion: 1,
    draft,
  };
}

export function deserializeBuilderDraft(serialized: SerializedBuilderDraft): BuilderDraft {
  if (serialized.schemaVersion !== 1) {
    throw new Error(`Unsupported builder draft schema version: ${serialized.schemaVersion}`);
  }

  return serialized.draft;
}
