import { RegistryView } from '@/components/builder/registry/RegistryView';
import { initializePlatformKernel } from '@/platform/kernel';
import { listActions } from '@/platform/actions';
import { mapActionToRegistryItem } from '@/components/builder/registry/action-mapper';

export default async function RegistryPage() {
  initializePlatformKernel();

  const platformActions = listActions();
  const mappedActions = platformActions.map(mapActionToRegistryItem);

  return (
    <div className="h-full">
      <RegistryView realItems={mappedActions} />
    </div>
  );
}
