import { RegistryView } from '@/components/builder/registry/RegistryView';
import { initializePlatformKernel } from '@/platform/kernel';
import { listActions } from '@/platform/actions';
import { RegistryItem } from '@/components/builder/registry/registry-types';
import { mapActionToRegistryItem } from '@/components/builder/registry/registry-mappers';
import { EmptyState } from '@/components/builder/shared/EmptyState';
import { Database } from 'lucide-react';

export default async function RegistryPage() {
  initializePlatformKernel();

  const platformActions = listActions();

  const mappedActions: RegistryItem[] = platformActions.map(mapActionToRegistryItem);

  if (mappedActions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon={Database}
          title="Nenhum item registrado"
          description="O registro de capacidades está vazio no momento."
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <RegistryView realItems={mappedActions} />
    </div>
  );
}
