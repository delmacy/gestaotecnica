"use client";

import { cn } from "@/lib/utils";
import { Info, Settings, Shield, Zap, History, Rocket, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function BuilderInspector({ selectedItem, onUpdate, onActivate }: {
  selectedItem: any;
  onUpdate?: (id: string, updates: any) => void;
  onActivate?: (item: any) => void;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!selectedItem) {
    return (
      <aside className="w-80 border-l bg-card/50 flex flex-col shrink-0 items-center justify-center p-8 text-center">
        <Info className="size-12 text-muted-foreground/20 mb-4" />
        <h3 className="text-sm font-medium text-muted-foreground">Nenhum item selecionado</h3>
        <p className="text-xs text-muted-foreground/60 mt-1">Selecione um elemento na árvore ou no canvas para ver suas propriedades.</p>
      </aside>
    );
  }

  const handleApply = () => {
    setIsApplying(true);
    // Simulate application of changes to the system
    setTimeout(() => {
      setIsApplying(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const isCatalogItem = selectedItem.type === 'catalog_item';

  return (
    <aside className="w-80 border-l bg-card/50 flex flex-col shrink-0">
      <div className="h-10 flex items-center px-4 border-b shrink-0 bg-muted/30">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inspector</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b bg-muted/10">
          <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">{selectedItem.type || 'Element'}</div>
          <h2 className="text-base font-semibold">{selectedItem.label}</h2>
          <div className="text-xs text-muted-foreground mt-1 font-mono">ID: {selectedItem.id}</div>
        </div>

        <div className="p-4 space-y-6">
          {/* Activation for Catalog Items */}
          {isCatalogItem && (
            <section className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Rocket className="size-4" />
                <h3 className="text-xs font-bold uppercase tracking-tight">Capacidade Disponível</h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                Esta capacidade faz parte do core replicável da plataforma. Você pode ativá-la em um workspace para compor sua arquitetura.
              </p>
              <button
                onClick={() => onActivate?.(selectedItem)}
                className="w-full bg-primary text-primary-foreground text-[10px] font-bold py-1.5 rounded uppercase hover:opacity-90 transition-opacity"
                data-testid="btn-activate-capability"
              >
                Ativar no Workspace
              </button>
            </section>
          )}

          {/* Properties Section */}
          <section key={selectedItem.id}>
            <div className="flex items-center gap-2 mb-3">
              <Settings className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">Properties</h3>
            </div>
            <div className="space-y-3">
              <div className="grid gap-1">
                <label className="text-[10px] text-muted-foreground font-medium uppercase">Display Name</label>
                <input
                  className="w-full bg-background border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={selectedItem.label}
                  onChange={(e) => onUpdate?.(selectedItem.id, { label: e.target.value })}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-[10px] text-muted-foreground font-medium uppercase">Description</label>
                <textarea
                  className="w-full bg-background border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none min-h-20 resize-none"
                  placeholder={`Descreva este(a) ${selectedItem.type || 'elemento'}...`}
                  defaultValue={selectedItem.metadata?.description || ''}
                />
              </div>
            </div>
          </section>

          {/* Access & Permissions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">Governance</h3>
            </div>
            <div className="rounded-md border bg-muted/30 p-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Allowed Roles</span>
                <span className="font-medium">Admin, Manager</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Visibility</span>
                <span className="font-medium text-green-600">Public</span>
              </div>
            </div>
          </section>

          {/* Connected Actions */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">
                {selectedItem.type === 'capability' ? 'Actions' : 'Capabilities'}
              </h3>
            </div>
            <div className="space-y-1">
              {selectedItem.metadata?.key ? (
                <div className="text-xs p-2 bg-muted/20 rounded border border-dashed border-muted-foreground/20 text-muted-foreground italic">
                  Extending {selectedItem.metadata.key} core actions...
                </div>
              ) : (
                ['create', 'update', 'delete', 'archive'].map(act => (
                  <div key={act} className="flex items-center gap-2 text-xs p-1.5 hover:bg-muted/50 rounded cursor-pointer group">
                    <div className="size-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <span className="font-mono text-muted-foreground">{selectedItem.id}.</span>
                    <span className="font-medium">{act}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Audit/History */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <History className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">Metadata</h3>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              CREATED_AT: 2024-03-20T10:00:00Z<br/>
              CREATED_BY: system_bootstrap<br/>
              VERSION: 1.0.4-stable
            </div>
          </section>
        </div>
      </div>

      <div className="p-4 border-t shrink-0">
        <button
          onClick={handleApply}
          disabled={isApplying}
          className={cn(
            "w-full text-xs font-bold py-2 rounded shadow-sm transition-all uppercase flex items-center justify-center gap-2",
            showSuccess ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
          )}
          data-testid="btn-apply-changes"
        >
          {isApplying ? "Applying..." : showSuccess ? <><CheckCircle2 className="size-4" /> Changes Applied</> : "Apply Changes"}
        </button>
      </div>
    </aside>
  );
}
