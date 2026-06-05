import type { RuntimeDb } from "./runtime.repository";
import { insertProcessInstance, insertProcessPayload } from "./runtime.repository";
import { startProcessInstanceInputSchema } from "./runtime.validation";
import type { StartProcessInstanceInput, ProcessInstanceRecord } from "./runtime.types";
import type { RuntimeResult } from "./runtime.errors";
import { processVersions } from "@/db/runtime/schema/workflow";
import { eq } from "drizzle-orm";

export async function startProcessInstance(
  db: RuntimeDb,
  input: StartProcessInstanceInput
): Promise<RuntimeResult<ProcessInstanceRecord>> {
  try {
    // 1. Validar input
    const parseResult = startProcessInstanceInputSchema.safeParse(input);
    if (!parseResult.success) {
      return {
        ok: false,
        error: {
          code: "INVALID_INPUT",
          message: "Invalid input parameters for starting process instance.",
        },
      };
    }

    const { workspaceId, processVersionId, createdById, initialPayload } = parseResult.data;

    // 2. Buscar a versão do processo e verificar status publicado
    // Fazemos essa query direto pois precisamos do status e ela precisa funcionar com o db injetado.
    const [version] = await db
      .select({ id: processVersions.id, status: processVersions.status })
      .from(processVersions)
      .where(eq(processVersions.id, processVersionId));

    if (!version) {
      return {
        ok: false,
        error: {
          code: "PROCESS_VERSION_NOT_FOUND",
          message: "The specified process version does not exist.",
        },
      };
    }

    if (version.status !== "published") {
      return {
        ok: false,
        error: {
          code: "PROCESS_VERSION_NOT_PUBLISHED",
          message: "Cannot start an instance for a process version that is not published.",
        },
      };
    }

    // 3. Criar instância
    // Por enquanto, currentStateId fica nulo e resolvemos isso na engine nas próximas fases.
    const instance = await insertProcessInstance(db, {
      workspaceId,
      processVersionId,
      createdById,
      status: "active",
      currentStateId: null,
    });

    // 4. Salvar o payload inicial
    if (initialPayload && Object.keys(initialPayload).length > 0) {
      await insertProcessPayload(db, {
        instanceId: instance.id,
        workspaceId,
        schemaVersion: "1.0",
        data: initialPayload,
      });
    }

    return {
      ok: true,
      data: instance,
    };
  } catch {
    // Captura qualquer exception não tratada no repositório ou de acesso
    return {
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while starting the process instance.",
      },
    };
  }
}
