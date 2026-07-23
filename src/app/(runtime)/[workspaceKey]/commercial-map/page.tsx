import { CommercialMap } from "@/components/commercial-map/CommercialMap";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function CommercialMapPage({
  params
}: {
  params: Promise<{ workspaceKey: string }>
}) {
  const { workspaceKey } = await params;

  const db = getDb();
  const [workspace] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.key, workspaceKey))
    .limit(1);

  if (!workspace) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <CommercialMap workspaceId={workspace.id} />
    </div>
  );
}
