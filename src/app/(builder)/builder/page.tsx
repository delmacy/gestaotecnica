import { BuilderShell } from "@/builder/shell/builder-shell";
import { getBuilderTreeData } from "@/builder/server/builder-tree";

export const dynamic = "force-dynamic";

export default async function BuilderPage() {
  const { treeData, initialWorkspaceId } = await getBuilderTreeData();

  return <BuilderShell initialTreeData={treeData} initialWorkspaceId={initialWorkspaceId} />;
}
