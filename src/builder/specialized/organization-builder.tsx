"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Globe, Users, ShieldCheck, Zap, Layers, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { executeKernelAction } from "@/platform/actions/remote-actions";

export function OrganizationBuilder({ activeItem }: { activeItem: any }) {
  const isWorkspace = activeItem.type === 'workspace';
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: activeItem.label, key: activeItem.metadata?.key || activeItem.id });

  const handleCreateChild = async () => {
    setIsCreating(true);
    try {
      if (activeItem.type === 'organization') {
        const result = await executeKernelAction("workspaces.create", {
          organizationId: activeItem.id,
          key: "ws-" + Date.now(),
          name: "Novo Workspace"
        });
        if (result.success) alert("Workspace criado com sucesso no banco de dados!");
      } else {
        const result = await executeKernelAction("organizations.create", {
          key: "org-" + Date.now(),
          name: "Nova Organização"
        });
        if (result.success) alert("Nova Organização registrada no tenant!");
      }
    } catch (e) {
      alert("Falha ao persistir no banco.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-muted/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{activeItem.label}</h1>
            <p className="text-muted-foreground mt-1">Configuração de {activeItem.type === 'organization' ? 'Tenant Organizacional' : 'Ambiente Operacional (Workspace)'}</p>
          </div>
          <button
            onClick={handleCreateChild}
            disabled={isCreating}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-bold uppercase shadow-sm hover:opacity-90 flex items-center gap-2"
          >
            {isCreating && <Loader2 className="size-4 animate-spin" />}
            {activeItem.type === 'organization' ? '+ New Workspace' : 'Configure Domain'}
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card>
             <CardHeader><CardTitle className="text-sm">Metadata</CardTitle></CardHeader>
             <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Identificador (Key)</Label>
                  <Input value={formData.key} readOnly className="bg-muted font-mono text-xs" />
                </div>
                <div className="grid gap-2">
                  <Label>Nome Amigável</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
             </CardContent>
           </Card>

           <div className="grid gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                   <div className="size-10 rounded bg-blue-100 text-blue-700 flex items-center justify-center"><Users className="size-5" /></div>
                   <div>
                      <div className="text-2xl font-bold">124</div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Active Populations</p>
                   </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                   <div className="size-10 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center"><Layers className="size-5" /></div>
                   <div>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Activated Capabilities</p>
                   </div>
                </CardContent>
              </Card>
           </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Recursos do {activeItem.type === 'organization' ? 'Tenant' : 'Workspace'}</h2>
          <div className="grid gap-3 md:grid-cols-2">
             {[
               { icon: Users, label: "Gestão de Usuários", desc: "Controle de acesso e provisionamento." },
               { icon: ShieldCheck, label: "Políticas de Segurança", desc: "Definição de papéis e permissões (RBAC)." },
               { icon: Globe, label: "Configuração de Domínio", desc: "Mapeamento DNS e branding customizado." },
               { icon: Zap, label: "Webhooks & API Keys", desc: "Pontos de entrada para sistemas externos." }
             ].map((item, i) => (
               <div key={i} className="flex items-start gap-4 p-4 bg-white border rounded-xl hover:shadow-md transition-all cursor-pointer group">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{item.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {isWorkspace && (
          <div className="space-y-4 bg-white border rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Active Capability Pack</h2>
              <button className="text-xs font-bold text-primary flex items-center gap-1">
                <Plus className="size-3" /> Install More
              </button>
            </div>
            <div className="space-y-2">
              {['Work Management', 'Asset Tracking', 'Workforce Optimization'].map(pack => (
                <div key={pack} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-white flex items-center justify-center shadow-sm">
                      <Layers className="size-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">{pack}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">Deployed</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
