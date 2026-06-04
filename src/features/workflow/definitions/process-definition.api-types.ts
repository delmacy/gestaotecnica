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

import type { ProcessDefinitionRecord, ProcessVersionRecord } from "./process-definition.types";

export type ListProcessDefinitionsResult = {
  ok: true;
  data: {
    items: ProcessDefinitionRecord[];
  };
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
    processDefinition: ProcessDefinitionRecord;
    latestVersion?: ProcessVersionRecord;
  };
} | {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};
