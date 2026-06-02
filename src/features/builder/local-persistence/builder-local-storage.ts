import type { BuilderDraft } from "../types";
import { serializeBuilderDraft, deserializeBuilderDraft } from "../process-editor/serialize-builder-draft";
import { validateBuilderDraft } from "../process-editor/validate-builder-draft";

export const BUILDER_LOCAL_STORAGE_KEY = "system-builder:draft:v1";

export type LoadLocalBuilderDraftResult =
  | { ok: true; draft: BuilderDraft }
  | { ok: false; reason: string };

export function saveBuilderDraftToLocalStorage(draft: BuilderDraft): void {
  if (typeof window === "undefined") return;

  const serialized = serializeBuilderDraft(draft);
  window.localStorage.setItem(BUILDER_LOCAL_STORAGE_KEY, JSON.stringify(serialized));
}

export function loadBuilderDraftFromLocalStorage(): LoadLocalBuilderDraftResult {
  if (typeof window === "undefined") {
    return { ok: false, reason: "localStorage indisponível no servidor." };
  }

  const raw = window.localStorage.getItem(BUILDER_LOCAL_STORAGE_KEY);
  if (!raw) {
    return { ok: false, reason: "Nenhum rascunho local encontrado." };
  }

  try {
    const parsed = JSON.parse(raw);
    const draft = deserializeBuilderDraft(parsed);
    const validation = validateBuilderDraft(draft);

    if (!validation.valid) {
      return { ok: false, reason: "Rascunho local inválido." };
    }

    return { ok: true, draft };
  } catch {
    return { ok: false, reason: "Falha ao carregar rascunho local." };
  }
}

export function clearBuilderDraftFromLocalStorage(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(BUILDER_LOCAL_STORAGE_KEY);
}
