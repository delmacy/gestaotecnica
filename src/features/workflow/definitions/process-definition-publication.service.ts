import type { ProcessDefinitionDb } from "./process-definition.repository";
import { getProcessDefinitionById } from "./process-definition.queries";
import { publishProcessVersionRecord, markProcessDefinitionAsPublished } from "./process-definition.repository";
import type { PublishProcessVersionInput, PublishProcessVersionResult } from "./process-definition-publication.types";
import { ProcessDefinitionValidationError } from "./process-definition.errors";

export async function publishProcessVersion(
  db: ProcessDefinitionDb,
  input: PublishProcessVersionInput
): Promise<PublishProcessVersionResult> {
  if (!input.workspaceId || !input.processDefinitionId || !input.processVersionId) {
    return {
      ok: false,
      error: { code: "INVALID_INPUT", message: "Faltam parâmetros obrigatórios para publicar a versão." },
    };
  }

  try {
    const process = await getProcessDefinitionById(db, input.workspaceId, input.processDefinitionId);

    if (!process) {
      return {
        ok: false,
        error: { code: "NOT_FOUND", message: "Definição de processo não encontrada no workspace especificado." },
      };
    }

    if (!process.latestVersion) {
      return {
        ok: false,
        error: { code: "NO_VERSION", message: "Nenhuma versão encontrada para publicar." },
      };
    }

    if (process.latestVersion.id !== input.processVersionId) {
      return {
        ok: false,
        error: { code: "VERSION_MISMATCH", message: "O ID da versão especificado não corresponde à versão mais recente." },
      };
    }

    const versionRecord = await publishProcessVersionRecord(db, {
      processDefinitionId: input.processDefinitionId,
      processVersionId: input.processVersionId,
    });

    if (!versionRecord) {
      return {
        ok: false,
        error: { code: "UPDATE_FAILED", message: "Falha ao publicar a versão do processo." },
      };
    }

    await markProcessDefinitionAsPublished(db, {
      processDefinitionId: input.processDefinitionId,
    });

    return {
      ok: true,
      data: {
        processDefinitionId: input.processDefinitionId,
        processVersionId: input.processVersionId,
        status: "published",
        publishedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: { code: "SERVICE_ERROR", message: "Ocorreu um erro ao publicar a versão do processo." },
    };
  }
}
