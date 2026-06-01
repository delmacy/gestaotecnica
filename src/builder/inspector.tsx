"use client";

import { cn } from "@/lib/utils";
import { Info, Settings, Zap, History, Rocket, Database } from "lucide-react";

export function BuilderInspector({ selectedItem, onUpdate, onActivate, activeWorkspaceId }: {
  selectedItem: any;
  onUpdate?: (id: string, updates: any) => void;
  onActivate?: (item: any) => void;
  activeWorkspaceId?: string | null;
}) {
  if (!selectedItem) {
    return (
      <aside className="w-80 border-l bg-card/50 flex flex-col shrink-0 items-center justify-center p-8 text-center">
        <Info className="size-12 text-muted-foreground/20 mb-4" />
        <h3 className="text-sm font-medium text-muted-foreground">Nenhum item selecionado</h3>
        <p className="text-xs text-muted-foreground/60 mt-1">Selecione um elemento na árvore ou no canvas para ver suas propriedades.</p>
      </aside>
    );
  }

  const isCatalogItem = selectedItem.type === 'catalog_item';
  const actions = Array.isArray(selectedItem.metadata?.actions) ? selectedItem.metadata.actions : [];
  const metadataEntries = Object.entries(selectedItem.metadata || {})
    .filter(([key, value]) => !["raw", "config", "definition", "actions"].includes(key) && value !== null && value !== undefined && value !== "")
    .slice(0, 10);

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
                Esta capacidade vem de {selectedItem.metadata?.source}. Ative em um workspace real para persistir em workspace_module_configs.
              </p>
              <div className="text-[10px] font-mono text-muted-foreground mb-3 truncate">
                WORKSPACE: {activeWorkspaceId || "selecione um workspace"}
              </div>
              <button
                onClick={() => onActivate?.(selectedItem)}
                disabled={!activeWorkspaceId}
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
                <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Display Name</label>
                <input
                  className="w-full bg-background border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                  value={selectedItem.label}
                  onChange={(e) => onUpdate?.(selectedItem.id, { label: e.target.value })}
                />
              </div>

              {selectedItem.type === 'organization' && (
                <div className="grid gap-1">
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Org Key (Slug)</label>
                  <input
                    className="w-full bg-muted/50 border rounded px-2 py-1 text-xs font-mono outline-none"
                    defaultValue={selectedItem.metadata?.key || selectedItem.id}
                  />
                </div>
              )}

              {selectedItem.type === 'workspace' && (
                <div className="grid gap-1">
                  <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Status</label>
                  <input
                    className="w-full bg-muted/50 border rounded px-2 py-1 text-xs font-mono outline-none"
                    readOnly
                    value={selectedItem.metadata?.status || "sem status"}
                  />
                </div>
              )}

              <div className="grid gap-1">
                <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">Description</label>
                <textarea
                  className="w-full bg-background border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none min-h-20 resize-none"
                  placeholder={`Descreva este(a) ${selectedItem.type || 'elemento'}...`}
                  value={selectedItem.metadata?.description || ''}
                  onChange={(e) => onUpdate?.(selectedItem.id, { metadata: { ...selectedItem.metadata, description: e.target.value } })}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">Origem dos Dados</h3>
            </div>
            <div className="rounded-md border bg-muted/30 p-2 space-y-2">
              {metadataEntries.map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-mono text-right truncate">{String(value)}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">
                {selectedItem.type === 'capability' ? 'Actions' : 'Capabilities'}
              </h3>
            </div>
            <div className="space-y-1">
              {actions.length ? (
                actions.map((action: any) => (
                  <div key={action.key} className="text-xs p-2 bg-muted/20 rounded border border-muted-foreground/20">
                    <div className="font-mono font-medium">{action.key}</div>
                    {action.description && <div className="text-[10px] text-muted-foreground mt-1">{action.description}</div>}
                  </div>
                ))
              ) : (
                <div className="text-xs p-2 bg-muted/20 rounded border border-dashed border-muted-foreground/20 text-muted-foreground italic">
                  Nenhuma action registrada para esta chave.
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3">
              <History className="size-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-tight">Rastreabilidade</h3>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              SOURCE: {selectedItem.metadata?.source || "client_state"}<br/>
              CREATED_AT: {selectedItem.metadata?.createdAt || "n/a"}<br/>
              UPDATED_AT: {selectedItem.metadata?.updatedAt || "n/a"}
            </div>
          </section>
        </div>
      </div>

      <div className="p-4 border-t shrink-0">
        <div className={cn("rounded border bg-muted/30 p-2 text-[10px] text-muted-foreground", selectedItem.metadata?.source && "border-primary/20")}>
          Alterações estruturais devem passar por uma kernel action registrada. Campos editáveis aqui só alteram a sessão visual até existir action específica.
        </div>
      </div>
    </aside>
  );
}
