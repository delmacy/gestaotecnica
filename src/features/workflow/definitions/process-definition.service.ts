import type { BuilderDraft, SerializedBuilderDraft } from "@/features/builder/types";
import { serializeBuilderDraft } from "@/features/builder/process-editor/serialize-builder-draft";
import { validateBuilderDraft } from "@/features/builder/process-editor/validate-builder-draft";
import type {
  CreateProcessDefinitionInput,
  CreateProcessDefinitionResult,
  ProcessDefinitionRecord,
  ProcessVersionRecord,
  ProcessDefinitionStatus,
  ProcessVersionStatus,
} from "./process-definition.types";
import { validateCreateProcessDefinitionInput } from "./process-definition.validation";
import {
  ProcessDefinitionValidationError,
  ProcessDefinitionPersistenceError,
} from "./process-definition.errors";
import {
  insertProcessDefinition,
  insertProcessVersion,
  getLatestProcessVersionNumber,
  type ProcessDefinitionDb,
} from "./process-definition.repository";

function normalizeProcessDefinitionRecord(row: any): ProcessDefinitionRecord {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    key: row.key,
    name: row.name,
    description: row.description,
    status: row.status as ProcessDefinitionStatus,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
  };
}

function normalizeProcessVersionRecord(row: any): ProcessVersionRecord {
  return {
    id: row.id,
    processDefinitionId: row.processDefinitionId,
    version: row.version,
    status: row.status as ProcessVersionStatus,
    definition: row.definitionJson as SerializedBuilderDraft,
    createdBy: row.createdBy,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
  };
}

export async function createProcessDefinition(
  db: ProcessDefinitionDb,
  input: CreateProcessDefinitionInput,
): Promise<CreateProcessDefinitionResult> {
  const validation = validateCreateProcessDefinitionInput(input);

  if (!validation.valid) {
    throw new ProcessDefinitionValidationError(
      "Dados inválidos para criar o processo.",
      validation.issues,
    );
  }

  try {
    const serializedDraft = serializeBuilderDraft(input.draft);

    const definitionRow = await insertProcessDefinition(db, {
      workspaceId: input.workspaceId,
      key: input.key,
      name: input.name,
      description: input.description,
      status: "draft",
    });

    const versionRow = await insertProcessVersion(db, {
      processDefinitionId: definitionRow.id,
      version: 1,
      status: "draft",
      definitionJson: serializedDraft,
      createdBy: input.createdBy,
    });

    return {
      processDefinition: normalizeProcessDefinitionRecord(definitionRow),
      version: normalizeProcessVersionRecord(versionRow),
    };
  } catch (error) {
    throw new ProcessDefinitionPersistenceError("Falha ao salvar a definição de processo no banco de dados.", { cause: error });
  }
}

export async function createProcessVersion(
  db: ProcessDefinitionDb,
  input: {
    processDefinitionId: string;
    draft: BuilderDraft;
    createdBy?: string;
  },
): Promise<ProcessVersionRecord> {
  if (!input.processDefinitionId) {
    throw new ProcessDefinitionValidationError("O ID da definição do processo é obrigatório.", [
      { code: "PROCESS_DEF_ID_REQUIRED", message: "Process Definition ID ausente." }
    ]);
  }

  const draftValidation = validateBuilderDraft(input.draft);
  if (!draftValidation.valid) {
    throw new ProcessDefinitionValidationError("O draft do processo contém erros.", draftValidation.issues);
  }

  try {
    const latestVersion = await getLatestProcessVersionNumber(db, input.processDefinitionId);
    const nextVersion = latestVersion + 1;
    const serializedDraft = serializeBuilderDraft(input.draft);

    const versionRow = await insertProcessVersion(db, {
      processDefinitionId: input.processDefinitionId,
      version: nextVersion,
      status: "draft",
      definitionJson: serializedDraft,
      createdBy: input.createdBy,
    });

    return normalizeProcessVersionRecord(versionRow);
  } catch (error) {
    throw new ProcessDefinitionPersistenceError("Falha ao salvar a nova versão do processo no banco de dados.", { cause: error });
  }
}
