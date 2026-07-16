import type { ListSavedProcessesInputContract, ListSavedProcessesResultContract, LoadSavedProcessInputContract, LoadSavedProcessResultContract, SavedProcessListItemContract } from "@/platform/contracts/builder-client";
import type { BuilderDraft } from "../types";
import type {
  ProcessDefinitionRecord,
  ProcessVersionRecord,
} from "@/features/workflow/definitions";

export type SavedProcessListItem = SavedProcessListItemContract;

export type ListSavedProcessesInput = ListSavedProcessesInputContract;

export type ListSavedProcessesResult = ListSavedProcessesResultContract;

export type LoadSavedProcessInput = LoadSavedProcessInputContract;

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
