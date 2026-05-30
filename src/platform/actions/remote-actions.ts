"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "./action-runner";
import { listActions } from "./action-registry";
import { resolveWorkspaceContext } from "../workspace";
import { listEvents } from "../events/event-registry";

export async function executeKernelAction(
  actionKey: string,
  payload: unknown,
  path?: string,
) {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const result = await runAction(actionKey, payload, context);

  if (result.success && path) {
    revalidatePath(path);
  }

  return result;
}

export async function getPlatformDiscoveryData() {
  const actions = listActions().map(a => ({
    key: a.key,
    label: a.uiLabel || a.key,
    moduleKey: a.moduleKey,
    description: a.description
  }));

  const events = listEvents().map(e => ({
    key: e.key,
    moduleKey: e.moduleKey,
    description: e.description
  }));

  return { actions, events };
}
