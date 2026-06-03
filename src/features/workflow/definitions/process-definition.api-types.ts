import { type CreateProcessDefinitionInput, type CreateProcessDefinitionResult } from "./process-definition.types";

export type CreateProcessDefinitionServerInput = CreateProcessDefinitionInput;

export type CreateProcessDefinitionServerResult = {
  ok: true;
  data: CreateProcessDefinitionResult;
} | {
  ok: false;
  error: {
    code: string;
    message: string;
    issues?: unknown[];
  };
};

export type ListProcessDefinitionsResult = {
  ok: true;
  data: Array<{
    id: string;
    key: string;
    name: string;
    status: string;
    updatedAt?: string;
  }>;
} | {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type GetProcessDefinitionResult = {
  ok: true;
  data: {
    id: string;
    key: string;
    name: string;
    status: string;
    latestVersion?: number;
    definitionJson?: unknown;
  };
} | {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};
