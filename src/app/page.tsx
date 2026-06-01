"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Database, Activity, GitBranch } from "lucide-react";
import Link from "next/link";

export default function SystemBuilderDashboard() {
  return (
    <div className="flex-1 overflow-y-auto bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-extrabold tracking-tight">System Builder</h1>
          <p className="text-xl text-muted-foreground mt-2">Plataforma de Construção de Sistemas e Runtime Dinâmico</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/builder">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Builder Experience</CardTitle>
                <Layers className="size-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">IDE Visual</div>
                <p className="text-xs text-muted-foreground mt-1">Crie processos, views e fluxos</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tenants</CardTitle>
              <Database className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Multi-tenant</div>
              <p className="text-xs text-muted-foreground mt-1">Workspaces e isolamento de dados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Runtime Engines</CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Event Bus</div>
              <p className="text-xs text-muted-foreground mt-1">Processamento de Outbox</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Automações</CardTitle>
              <GitBranch className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Flow Runner</div>
              <p className="text-xs text-muted-foreground mt-1">Execução server-side de nós</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
