import { publishProcessVersionAction } from "@/features/workflow/definitions/process-definition-publication.actions";
import type { PublishBuilderProcessInput, PublishBuilderProcessResult } from "./builder-publish.types";

export async function publishBuilderProcess(
  input: PublishBuilderProcessInput
): Promise<PublishBuilderProcessResult> {
  try {
    const result = await publishProcessVersionAction(input);

    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error.code,
          message: result.error.message,
        },
      };
    }

    return {
      ok: true,
      data: {
        processDefinitionId: result.data.processDefinitionId,
        processVersionId: result.data.processVersionId,
        status: "published",
        publishedAt: result.data.publishedAt,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: "UNEXPECTED_PUBLISH_ERROR",
        message: "Ocorreu um erro inesperado ao publicar o processo.",
      },
    };
  }
}
