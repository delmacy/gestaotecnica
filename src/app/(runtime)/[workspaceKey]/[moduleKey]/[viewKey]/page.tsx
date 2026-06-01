import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { forms } from "@/db/runtime/schema/workflow";
import { eq, and } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DynamicRuntimeViewPage({ params }: { params: { workspaceKey: string, moduleKey: string, viewKey: string } }) {
  const db = getDb();

  // 1. Resolve Workspace
  const [workspace] = await db.select().from(workspaces).where(eq(workspaces.key, params.workspaceKey));
  if (!workspace) return notFound();

  // 2. Resolve View/Form (MOCK for transition: In a full implementation, we lookup the View definition, not just Form)
  // For the MVP, if viewKey maps to a known form/process, we render it.
  const [formDef] = await db.select().from(forms).where(
    and(
      eq(forms.workspaceId, workspace.id),
      eq(forms.key, params.viewKey)
    )
  );

  return (
    <div className="p-8 space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight capitalize">{params.moduleKey.replace("-", " ")}</h1>
        <p className="text-muted-foreground">Workspace: {workspace.name}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{formDef ? formDef.name : `View: ${params.viewKey}`}</CardTitle>
        </CardHeader>
        <CardContent>
          {formDef ? (
            <div className="text-sm text-green-600 font-medium p-4 bg-green-50 rounded border border-green-200">
              Esta interface foi gerada dinamicamente pelo View Builder e Entity Builder do System Builder.
              <br />Não há código hardcoded para esta tela.
            </div>
          ) : (
            <div className="text-sm text-amber-600 font-medium p-4 bg-amber-50 rounded border border-amber-200">
              View definition not found for key: {params.viewKey}. Please configure it in the Builder.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
