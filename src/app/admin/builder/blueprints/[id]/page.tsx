import { platformDb } from "@/db";
import { blueprints, blueprintVersions } from "@/db/platform/schema/blueprints";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProcessCanvas } from "@/platform/workflow-engine/components/ProcessCanvas";

export default async function BlueprintDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [blueprint] = await platformDb.select().from(blueprints).where(eq(blueprints.id, id));

  if (!blueprint) return <div>Blueprint não encontrado.</div>;

  const [latestVersion] = await platformDb
    .select()
    .from(blueprintVersions)
    .where(eq(blueprintVersions.blueprintId, id))
    .orderBy(desc(blueprintVersions.createdAt))
    .limit(1);

  const definition = (latestVersion?.definition as any) || {};
  const processes = definition.processes || [];

  return (
    <div className="container mx-auto p-8 space-y-8">
       <Button asChild variant="ghost" className="mb-2">
            <Link href="/admin/builder/blueprints">← Voltar para Lista</Link>
       </Button>

       <div className="flex justify-between items-start">
         <div>
           <h1 className="text-3xl font-bold">{blueprint.name}</h1>
           <p className="text-muted-foreground">{blueprint.description}</p>
         </div>
         <Badge variant="outline">Versão {latestVersion?.version || "N/A"}</Badge>
       </div>

       <div className="grid grid-cols-1 gap-8">
         {processes.map((proc: any) => (
           <Card key={proc.key}>
             <CardHeader>
               <CardTitle>Processo: {proc.name}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div>
                   <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">
                     Mapa de Estados e Transições
                   </h4>
                   <ProcessCanvas
                     states={proc.states.map((s: any) => ({ key: s.key, name: s.name }))}
                     transitions={proc.transitions.map((t: any) => ({
                       key: t.key,
                       from: t.from,
                       to: t.to,
                       name: t.name
                     }))}
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <h5 className="font-bold text-sm mb-2">Estados ({proc.states.length})</h5>
                    <ul className="text-sm space-y-1">
                      {proc.states.map((s: any) => (
                        <li key={s.key} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {s.name} <span className="text-[10px] text-muted-foreground">({s.key})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                   <div className="border rounded p-4">
                    <h5 className="font-bold text-sm mb-2">Transições ({proc.transitions.length})</h5>
                    <ul className="text-sm space-y-1">
                      {proc.transitions.map((t: any) => (
                        <li key={t.key} className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                           {t.name} <span className="text-[10px] text-muted-foreground">({t.from} → {t.to})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
             </CardContent>
           </Card>
         ))}
       </div>
    </div>
  );
}

// Minimal Badge for local use if needed
function Badge({ children, variant = "default" }: any) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
      variant === "outline" ? "border border-input" : "bg-primary text-primary-foreground"
    }`}>
      {children}
    </span>
  );
}
