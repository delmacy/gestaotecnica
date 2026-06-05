import type { ProcessDefinitionDb } from "./process-definition.repository";
import { publishProcessVersion } from "./process-definition-publication.service";
import type { PublishProcessVersionInput, PublishProcessVersionResult } from "./process-definition-publication.types";

export async function publishProcessVersionServer(
  db: ProcessDefinitionDb,
  input: PublishProcessVersionInput
): Promise<PublishProcessVersionResult> {
  try {
    return await publishProcessVersion(db, input);
  } catch (err: unknown) {
    return {
      ok: false,
      error: {
        code: "SERVER_ERROR",
        message: "Ocorreu um erro interno inesperado ao publicar a versão do processo.",
      },
    };
  }
}
