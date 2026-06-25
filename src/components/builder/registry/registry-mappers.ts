import { ActionDefinition } from '@/platform/actions';
import { RegistryItem } from '@/components/builder/registry/registry-types';

export function mapActionToRegistryItem(action: ActionDefinition): RegistryItem {
  const emittedEvents = action.emits && action.emits.length > 0 ? action.emits.join(', ') : 'None';
  const callableContexts = action.callableBy && action.callableBy.length > 0 ? action.callableBy.join(', ') : 'None';
  const requiredScopes = action.requiredScopes && action.requiredScopes.length > 0 ? action.requiredScopes.join(', ') : 'None';

  return {
    id: `action-${action.key}`,
    name: action.uiLabel || action.key.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
    slug: action.key,
    type: 'action',
    description: action.uiDescription || action.description || 'No description provided.',
    status: 'documented',
    source_document: undefined,
    related_capability: action.moduleKey,
    depends_on: action.requiredModules || [],
    used_by: action.callableBy || [],
    rules: [],
    document_links: [],
    risk_level: 'low',
    notes: [
      `Module Key: ${action.moduleKey}`,
      `Target Entity: ${action.targetEntity || 'N/A'}`,
      `Required Scopes: ${requiredScopes}`,
      `Emits: ${emittedEvents}`,
      `Callable By: ${callableContexts}`,
      `Idempotent: ${action.idempotent ? 'Yes' : 'No'}`,
    ].join('\n'),
    synthetic: false,
  };
}
