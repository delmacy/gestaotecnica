"use client";

import { useEffect } from "react";
import type { BuilderDraft } from "../types";
import { saveBuilderDraftToLocalStorage } from "./builder-local-storage";

export type UseBuilderLocalAutosaveInput = {
  draft: BuilderDraft;
  enabled: boolean;
  debounceMs?: number;
  onSaved?: () => void;
  onError?: (message: string) => void;
};

export function useBuilderLocalAutosave({
  draft,
  enabled,
  debounceMs = 800,
  onSaved,
  onError,
}: UseBuilderLocalAutosaveInput): void {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      try {
        saveBuilderDraftToLocalStorage(draft);
        onSaved?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha desconhecida ao salvar.";
        onError?.(message);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [draft, enabled, debounceMs, onSaved, onError]);
}
