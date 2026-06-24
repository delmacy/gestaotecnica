import { RegistryView } from '@/components/builder/registry/RegistryView';
import { initializePlatformKernel } from '@/platform/kernel';
import { listActions } from '@/platform/actions';
import { RegistryItem } from '@/components/builder/registry/registry-types';

export default async function RegistryPage() {
  initializePlatformKernel();

  const platformActions = listActions();

  const mappedActions: RegistryItem[] = platformActions.map((action) => ({
    id: `action-${action.key}`,
    name: action.key.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
    slug: action.key,
    type: 'action',
    description: action.description || 'No description provided.',
    status: 'documented',
    source_document: undefined,
    related_capability: action.moduleKey,
    depends_on: action.requiredModules || [],
    used_by: action.callableBy || [],
    rules: [],
    document_links: [],
    risk_level: 'low',
    notes: `Emits: ${(action.emits || []).join(', ') || 'None'} | Idempotent: ${action.idempotent ? 'Yes' : 'No'}`,
    synthetic: false,
  }));

  return (
    <div className="h-full">
      <RegistryView realItems={mappedActions} />
    </div>
  );
}
