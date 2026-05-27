import { emitEvent } from "@/platform/events";
import { isModuleEnabled } from "@/platform/modules";
import type { WorkspaceContext } from "@/platform/workspace";
import { getAction } from "./action-registry";
import type { ActionResult } from "./action-types";

function fail(code: string, message: string): ActionResult {
  return { success: false, error: { code, message } };
}

function hasScope(context: WorkspaceContext, requiredScope: string) {
  return context.scopes.includes("*") || context.scopes.includes(requiredScope);
}

export async function runAction(
  actionKey: string,
  input: unknown,
  context: WorkspaceContext,
): Promise<ActionResult> {
  const action = getAction(actionKey);
  if (!action) return fail("ACTION_NOT_FOUND", `Action nao encontrada: ${actionKey}`);

  if (!isModuleEnabled(context, action.moduleKey)) {
    return fail("MODULE_NOT_ENABLED", `Modulo nao habilitado: ${action.moduleKey}`);
  }

  const missingModule = action.requiredModules?.find((moduleKey) => !isModuleEnabled(context, moduleKey));
  if (missingModule) {
    return fail("MODULE_NOT_ENABLED", `Modulo requerido nao habilitado: ${missingModule}`);
  }

  const missingScope = action.requiredScopes?.find((scope) => !hasScope(context, scope));
  if (missingScope) {
    return fail("FORBIDDEN", `Escopo requerido ausente: ${missingScope}`);
  }

  if (action.callableBy && !action.callableBy.includes(context.source)) {
    return fail("FORBIDDEN", `Action nao pode ser chamada pela fonte: ${context.source}`);
  }

  try {
    const result = await action.handler(input, context);

    if (result.success && result.events) {
      for (const event of result.events) {
        await emitEvent(event, context);
      }
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: {
        code: "ACTION_FAILED",
        message: error instanceof Error ? error.message : "Falha ao executar action.",
        details: error,
      },
    };
  }
}
