import { CommercialMap } from "@/components/commercial-map/CommercialMap";
import { resolveWorkspaceContext } from "@/platform/workspace";

export default async function BuilderCommercialMapPage() {
  const context = await resolveWorkspaceContext({ source: "ui" });

  if (!context.workspaceId) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Workspace not found.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <CommercialMap workspaceId={context.workspaceId} />
    </div>
  );
}
