import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { integrationCommands } from "@/db/schema";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import type { IntegrationCommandRequest, IntegrationCommandResponse } from "./integration-command-types";

function asPayload(value: unknown) {
  return value && typeof value === "object" ? value : { value };
}

export async function routeIntegrationCommand(
  commandRequest: IntegrationCommandRequest,
): Promise<IntegrationCommandResponse> {
  const context = await resolveWorkspaceContext({
    workspaceKey: commandRequest.workspaceKey,
    source: "integration",
    actor: {
      type: "api_key",
      id: "gateway-api-key",
      name: "Integration Gateway",
    },
    scopes: ["*"],
  });

  const db = getDb();

  if (commandRequest.idempotencyKey) {
    const [existingCommand] = await db
      .select({
        status: integrationCommands.status,
        responsePayload: integrationCommands.responsePayload,
        errorPayload: integrationCommands.errorPayload,
        correlationId: integrationCommands.correlationId,
      })
      .from(integrationCommands)
      .where(
        and(
          eq(integrationCommands.workspaceKey, context.workspaceKey),
          eq(integrationCommands.idempotencyKey, commandRequest.idempotencyKey),
        ),
      )
      .limit(1);

    if (existingCommand) {
      const responsePayload = existingCommand.responsePayload as Partial<IntegrationCommandResponse>;
      return {
        success: existingCommand.status === "succeeded",
        data: responsePayload.data,
        error: responsePayload.error ?? (existingCommand.errorPayload as IntegrationCommandResponse["error"]),
        correlationId: existingCommand.correlationId,
      };
    }
  }

  const startedAt = new Date();
  const [persistedCommand] = await db
    .insert(integrationCommands)
    .values({
      workspaceId: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(context.workspaceId)
        ? context.workspaceId
        : undefined,
      workspaceKey: context.workspaceKey,
      command: commandRequest.command,
      status: "running",
      source: context.source,
      actorType: context.actor.type,
      actorId: context.actor.id,
      idempotencyKey: commandRequest.idempotencyKey,
      correlationId: context.correlationId,
      requestPayload: asPayload(commandRequest.payload ?? {}),
      startedAt,
    })
    .returning({ id: integrationCommands.id });

  const result = await runAction(commandRequest.command, commandRequest.payload ?? {}, context);
  const response: IntegrationCommandResponse = {
    success: result.success,
    data: result.data,
    error: result.error,
    correlationId: context.correlationId,
  };

  const finishedAt = new Date();
  await db
    .update(integrationCommands)
    .set({
      status: result.success ? "succeeded" : "failed",
      responsePayload: asPayload(response),
      errorPayload: result.error,
      finishedAt,
    })
    .where(eq(integrationCommands.id, persistedCommand.id));

  return response;
}
