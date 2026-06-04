import type { BuilderDraft } from "../types";
import type {
  ProcessDefinitionRecord,
  ProcessVersionRecord,
} from "@/features/workflow/definitions";

export type SavedProcessListItem = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  status: string;
  updatedAt?: string;
  createdAt?: string;
};

export type ListSavedProcessesInput = {
  workspaceId: string;
  status?: "draft" | "published" | "archived";
  limit?: number;
  offset?: number;
};

export type ListSavedProcessesResult =
  | { ok: true; data: { items: SavedProcessListItem[] } }
  | { ok: false; error: { code: string; message: string } };

export type LoadSavedProcessInput = {
  workspaceId: string;
  processDefinitionId: string;
};

export type LoadSavedProcessResult =
  | {
      ok: true;
      data: {
        processDefinition: ProcessDefinitionRecord;
        latestVersion?: ProcessVersionRecord;
        draft?: BuilderDraft;
      };
    }
  | { ok: false; error: { code: string; message: string } };
