import type { ActionDefinition } from "./action-types";

const actions = new Map<string, ActionDefinition>();

export function registerAction<TInput = unknown, TOutput = unknown>(
  action: ActionDefinition<TInput, TOutput>,
) {
  const storedAction = action as ActionDefinition;
  const existing = actions.get(action.key);
  if (existing) return existing;
  actions.set(action.key, storedAction);
  return storedAction;
}

export function getAction(actionKey: string) {
  return actions.get(actionKey);
}

export function listActions() {
  return Array.from(actions.values());
}
