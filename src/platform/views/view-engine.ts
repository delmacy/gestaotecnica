import { listActions } from "../actions/action-registry";
import type { WorkspaceContext } from "../workspace";

export type AvailableAction = {
  key: string;
  label: string;
  description?: string;
  moduleKey: string;
  source: string;
};

export async function getAvailableActionsForEntity(
  entityType: string,
  entityState: string,
  context: WorkspaceContext,
): Promise<AvailableAction[]> {
  // Discovery logic based on naming convention or explicit mapping
  // Convention: entityType.action (e.g., service_order.complete)
  const allActions = listActions();

  return allActions
    .filter(action => {
      // Check if action matches entity type
      // entityType = service_order, action.key = service_orders.complete
      const [actionModule] = action.key.split('.');
      const entityPrefix = entityType.replace(/_/g, '');
      const actionPrefix = actionModule.replace(/s$/, '').replace(/_/g, '');

      if (!action.key.startsWith(entityType) && !actionPrefix.startsWith(entityPrefix)) {
        // Fallback for simple pluralization (e.g. work_item -> work_items)
        if (!action.key.startsWith(`${entityType}s.`)) return false;
      }

      // Check if module is enabled
      if (!context.enabledModules.includes(action.moduleKey)) return false;

      // Check if callable by UI
      if (action.callableBy && !action.callableBy.includes("ui")) return false;

      // Filter by entityState if defined in action metadata
      if (action.allowedStatuses && !action.allowedStatuses.includes(entityState)) {
        return false;
      }

      return true;
    })
    .map(action => ({
      key: action.key,
      label: action.description || action.key,
      description: action.description,
      moduleKey: action.moduleKey,
      source: "kernel",
    }));
}
