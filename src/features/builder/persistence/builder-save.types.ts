import type { BuilderDraft } from "../types";

export type SaveBuilderDraftOfficialInput = {
  workspaceId: string;
  draft: BuilderDraft;
  createdBy?: string;
};

export type SaveBuilderDraftOfficialResult =
  | {
      ok: true;
      data: {
        processDefinitionId: string;
        versionId: string;
        version: number;
        savedAt: string;
      };
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
        issues?: unknown[];
      };
    };
