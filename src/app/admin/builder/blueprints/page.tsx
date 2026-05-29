import { platformDb } from "@/db";
import { blueprints } from "@/db/platform/schema/blueprints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Play } from "lucide-react";
import { BlueprintLoaderService } from "@/platform/blueprints/application/blueprint-loader.service";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

async function installSampleBlueprint() {
  "use server";
  const loader = new BlueprintLoaderService();
  const bpPath = path.join(process.cwd(), "blueprints/technical-operations/blueprint.yaml");
  const content = fs.readFileSync(bpPath, "utf-8");
  await loader.loadFromYaml(content);
  revalidatePath("/admin/builder/blueprints");
}

export default async function BlueprintsAdminPage() {
  const list = await platformDb.select().from(blueprints);

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Button asChild variant="ghost" className="mb-2">
            <Link href="/admin/builder">← Voltar</Link>
          </Button>
          <h1 className="text-3xl font-bold">Blueprints</h1>
        </div>
        <form action={installSampleBlueprint}>
          <Button type="submit">
            <Plus className="mr-2 h-4 w-4" /> Instalar Technical Ops
          </Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((bp: any) => (
                <TableRow key={bp.id}>
                  <TableCell className="font-medium">{bp.name}</TableCell>
                  <TableCell className="font-mono text-xs">{bp.key}</TableCell>
                  <TableCell className="text-muted-foreground">{bp.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                       <Link href={`/admin/builder/blueprints/${bp.id}`}>Ver Detalhes</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum blueprint instalado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
