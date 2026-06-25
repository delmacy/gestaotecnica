import { RegistryView } from '@/components/builder/registry/RegistryView';
import { initializePlatformKernel } from '@/platform/kernel';
import { listActions } from '@/platform/actions';
import { RegistryItem } from '@/components/builder/registry/registry-types';
import { mapActionToRegistryItem } from '@/components/builder/registry/registry-mappers';

export default async function RegistryPage() {
  initializePlatformKernel();

  const platformActions = listActions();

  const mappedActions: RegistryItem[] = platformActions.map(mapActionToRegistryItem);

  return (
    <div className="h-full">
      <RegistryView realItems={mappedActions} />
    </div>
  );
}
