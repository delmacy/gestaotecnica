import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LayoutDashboard, Settings, FileText, Blocks, ArrowRight, FormInput, Workflow } from 'lucide-react';

interface WorkspaceHomeProps {
  workspaceKey: string;
}

export function WorkspaceHome({ workspaceKey }: WorkspaceHomeProps) {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Workspace Home</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao workspace {workspaceKey}. Selecione uma ação para continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <FormInput className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Form Builder</CardTitle>
            <CardDescription>Criação visual e estruturação de formulários.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/builder/form-builder" className="flex justify-between items-center">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Workflow className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Workflow Builder</CardTitle>
            <CardDescription>Design and structure capability workflows.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/builder/workflow-builder" className="flex justify-between items-center">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <LayoutDashboard className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Visão geral e métricas do workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/${workspaceKey}/dashboard`} className="flex justify-between items-center">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <FileText className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Case Management</CardTitle>
            <CardDescription>Gerencie casos, solicitações e processos operacionais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={`/${workspaceKey}/case-management`} className="flex justify-between items-center">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Blocks className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Capabilities</CardTitle>
            <CardDescription>Explore e selecione capabilities para o seu workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/builder/capabilities" className="flex justify-between items-center">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <Settings className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Gerencie configurações e permissões do workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link href={`/${workspaceKey}/settings`} className="flex justify-between items-center">
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
