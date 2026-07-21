import { WorkspaceHome } from '@/components/runtime/workspace-home';

export default async function WorkspaceHomePage({ params }: { params: Promise<{ workspaceKey: string }> }) {
  const resolvedParams = await params;
  return <WorkspaceHome workspaceKey={resolvedParams.workspaceKey} />;
}
