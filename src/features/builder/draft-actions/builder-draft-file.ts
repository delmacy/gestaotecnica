import type { BuilderDraft } from "../types";
import { serializeBuilderDraft, deserializeBuilderDraft } from "../process-editor/serialize-builder-draft";
import { validateBuilderDraft } from "../process-editor/validate-builder-draft";

export function createDraftDownloadPayload(draft: BuilderDraft): {
  filename: string;
  content: string;
} {
  const serialized = serializeBuilderDraft(draft);
  const content = JSON.stringify(serialized, null, 2);
  const safeName = (draft.name || "novo-processo")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return {
    filename: `system-builder-${safeName}.json`,
    content,
  };
}

export function parseDraftJsonContent(content: string): BuilderDraft {
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error("O arquivo não é um JSON válido.");
  }

  const draft = deserializeBuilderDraft(parsed);

  const validationResult = validateBuilderDraft(draft);
  if (!validationResult.valid) {
    const errorMessages = validationResult.issues
      .filter((i) => i.severity === "error")
      .map((i) => `- ${i.message}`)
      .join("\n");

    throw new Error(`O rascunho importado possui erros de validação:\n${errorMessages}`);
  }

  return draft;
}
