import type {
  CreateProcessDefinitionInput,
  CreateProcessDefinitionResult,
  ProcessDefinitionRecord,
  ProcessVersionRecord,
} from "./process-definition.types";

export type CreateProcessDefinitionRequest = CreateProcessDefinitionInput;

export type CreateProcessDefinitionResponse =
  | { ok: true; data: CreateProcessDefinitionResult }
  | { ok: false; error: { code: string; message: string; issues?: unknown[] } };

export type CreateProcessVersionRequest = {
  processDefinitionId: string;
  draft: CreateProcessDefinitionInput["draft"];
  createdBy?: string;
};

export type CreateProcessVersionResponse =
  | { ok: true; data: ProcessVersionRecord }
  | { ok: false; error: { code: string; message: string; issues?: unknown[] } };

export type ListProcessDefinitionsInput = {
  workspaceId: string;
  status?: "draft" | "published" | "archived";
  limit?: number;
  offset?: number;
};

export type ListProcessDefinitionsResponse =
  | { ok: true; data: { items: ProcessDefinitionRecord[] } }
  | { ok: false; error: { code: string; message: string } };

export type GetProcessDefinitionWithLatestVersionResponse =
  | {
      ok: true;
      data: {
        processDefinition: ProcessDefinitionRecord;
        latestVersion?: ProcessVersionRecord;
      };
    }
  | { ok: false; error: { code: string; message: string } };
