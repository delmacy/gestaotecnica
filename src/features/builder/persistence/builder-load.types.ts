import type { BuilderDraft } from "../types";
import type {
  ProcessDefinitionRecord,
  ProcessVersionRecord,
} from "@/features/workflow/definitions";
import type {
  SavedProcessListItem,
  ListSavedProcessesInput,
  ListSavedProcessesResult,
  LoadSavedProcessInput,
} from "@/platform/builder/contracts/builder-client-interactions";

export type { SavedProcessListItem, ListSavedProcessesInput, ListSavedProcessesResult, LoadSavedProcessInput };

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
