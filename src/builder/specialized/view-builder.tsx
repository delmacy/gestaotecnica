"use client";

import { Layout, Table, Kanban, Calendar, LayoutDashboard, History, FileText, Save, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { executeKernelAction } from "@/platform/actions/remote-actions";

export function ViewBuilder({ activeItem }: { activeItem: any }) {
  const [selectedTemplate, setSelectedTemplate] = useState('Kanban Board');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await executeKernelAction("views.save_definition", {
        workspaceId: "workspace-acme-prod",
        key: activeItem.id,
        name: activeItem.label,
        config: { template: selectedTemplate }
      });
      if (result.success) alert("View salva com sucesso!");
    } catch (e) {
      alert("Erro ao salvar view.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-muted/10 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-end justify-between border-b pb-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
              <Layout className="size-3" /> View Architecture
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{activeItem.label}</h1>
            <p className="text-muted-foreground mt-1">Configuração de interface para usuários finais (Runtime Experience).</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="text-xs font-bold uppercase border px-4 py-2 rounded hover:bg-white transition-colors">Preview UI</button>
             <button
               onClick={handleSave}
               disabled={isSaving}
               className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold uppercase shadow-sm flex items-center gap-2"
               data-testid="btn-save-view"
             >
               {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
               Save Layout
             </button>
          </div>
        </div>

        <div className="space-y-4">
           <h2 className="text-sm font-bold uppercase text-muted-foreground">Select View Template</h2>
           <div className="grid gap-4 md:grid-cols-4">
              {[
                { icon: Table, label: "Data Table", desc: "Listagem densa com filtros." },
                { icon: Kanban, label: "Kanban Board", desc: "Gestão visual de estados." },
                { icon: Calendar, label: "Operational Calendar", desc: "Visão temporal de OS." },
                { icon: LayoutDashboard, label: "Analytics Dashboard", desc: "Gráficos e KPIs reais." },
                { icon: History, label: "Timeline", desc: "Histórico de auditoria." },
                { icon: FileText, label: "Smart Form", desc: "Coleta de dados governada." }
              ].map((tmpl, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTemplate(tmpl.label)}
                  className={cn(
                  "p-4 rounded-xl border-2 bg-white hover:border-primary transition-all cursor-pointer group",
                  selectedTemplate === tmpl.label ? "border-primary ring-2 ring-primary/10" : "border-transparent shadow-sm"
                )}>
                   <tmpl.icon className={cn("size-6 mb-3", selectedTemplate === tmpl.label ? "text-primary" : "text-muted-foreground")} />
                   <h3 className="text-sm font-bold">{tmpl.label}</h3>
                   <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{tmpl.desc}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white border rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center border-dashed text-center">
           <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Layout className="size-8 text-muted-foreground/30" />
           </div>
           <h3 className="text-lg font-bold">Visual Layout Editor</h3>
           <p className="text-sm text-muted-foreground max-w-sm mt-2">
             Configurando {selectedTemplate}. Selecione uma entidade no Registry para começar a montar o layout desta View.
           </p>
           <button className="mt-6 border-2 border-primary text-primary px-6 py-2 rounded-lg text-xs font-bold uppercase hover:bg-primary hover:text-white transition-all">
             Initialize Components
           </button>
        </div>
      </div>
    </div>
  );
}
