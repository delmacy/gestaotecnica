"use server";

import { revalidatePath } from "next/cache";
import { runAction } from "./action-runner";
import { resolveWorkspaceContext } from "../workspace";

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
