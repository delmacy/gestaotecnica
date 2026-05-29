import { platformDb } from "@/db";
import { blueprints, blueprintVersions } from "@/db/platform/schema/blueprints";
import { modules, capabilities } from "@/db/platform/schema/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminBuilderPage() {
  const bpList = await platformDb.select().from(blueprints);
  const modList = await platformDb.select().from(modules);
  const capList = await platformDb.select().from(capabilities);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Builder</h1>
        <div className="flex gap-2">
           <Button asChild variant="outline">
              <Link href="/admin">Dashboard</Link>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Blueprints
              <Badge>{bpList.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Definições reutilizáveis de processos e configurações.
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/builder/blueprints">Gerenciar Blueprints</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Módulos
              <Badge>{modList.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Catálogo de módulos registrados na plataforma.
            </p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/admin/builder/modules">Ver Catálogo</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Capacidades
              <Badge>{capList.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Mapeamento de habilidades organizacionais.
            </p>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/admin/builder/capabilities">Mapear Capacidades</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
