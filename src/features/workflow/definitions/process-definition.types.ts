import type { BuilderDraft, SerializedBuilderDraft } from "@/features/builder/types";

export type ProcessDefinitionStatus = "draft" | "published" | "archived";

export type ProcessDefinitionRecord = {
  id: string;
  workspaceId: string;
  key: string;
  name: string;
  description?: string | null;
  status: ProcessDefinitionStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ProcessVersionStatus = "draft" | "published" | "archived";

export type ProcessVersionRecord = {
  id: string;
  processDefinitionId: string;
  version: number;
  status: ProcessVersionStatus;
  definition: SerializedBuilderDraft;
  createdBy?: string | null;
  createdAt?: string;
};

export type CreateProcessDefinitionInput = {
  workspaceId: string;
  key: string;
  name: string;
  description?: string;
  draft: BuilderDraft;
  createdBy?: string;
};

export type CreateProcessDefinitionResult = {
  processDefinition: ProcessDefinitionRecord;
  version: ProcessVersionRecord;
};
