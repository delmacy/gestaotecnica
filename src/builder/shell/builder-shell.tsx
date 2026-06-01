"use client";

import { useState } from "react";
import { BuilderExplorer, TreeItem } from "@/builder/explorer";
import { BuilderCanvas } from "@/builder/canvas";
import { BuilderInspector } from "@/builder/inspector";
import { BuilderTimeline, TimelineEntry } from "@/builder/shell/platform-timeline";
import { executeKernelAction } from "@/platform/actions/remote-actions";
import { getLiveTimelineEntries } from "@/platform/observability/actions/remote-actions";
import { Loader2, CheckCircle2, ChevronUp, ChevronDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";

let fallbackClientId = 0;

function createClientKey(prefix: string) {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  fallbackClientId += 1;
  return `${prefix}-${fallbackClientId}`;
}

export function BuilderShell({
  initialTreeData,
  initialWorkspaceId,
}: {
  initialTreeData: TreeItem[];
  initialWorkspaceId: string | null;
}) {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTreeData);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(initialWorkspaceId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [isRefreshingTimeline, setIsRefreshingTimeline] = useState(false);

  const refreshTimeline = useCallback(async () => {
    if (!activeWorkspaceId) {
      setTimelineEntries([]);
      return;
    }

    setIsRefreshingTimeline(true);
    try {
        const entries = await getLiveTimelineEntries(activeWorkspaceId);
        setTimelineEntries(entries);
    } finally {
        setIsRefreshingTimeline(false);
    }
  }, [activeWorkspaceId]);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void refreshTimeline();
    }, 0);
    const interval = setInterval(refreshTimeline, 10000); // Live update every 10s
    return () => {
      window.clearTimeout(refreshTimer);
      clearInterval(interval);
    };
  }, [refreshTimeline]);

  const addTimelineEntry = (entry: Omit<TimelineEntry, "id" | "timestamp">) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: createClientKey("timeline"),
      timestamp: "Agora"
    };
    setTimelineEntries(prev => [newEntry, ...prev].slice(0, 50));
  };

  const removeItem = (id: string) => {
    const filterItems = (items: TreeItem[]): TreeItem[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined
        }));
    };
    setTreeData(filterItems(treeData));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const addItem = async (parentId: string) => {
    const parent = findItemRecursive(treeData, parentId);

    if (parentId === 'orgs') {
      const key = createClientKey("org");
      const label = "Nova Organização";

      const result = await executeKernelAction("organizations.create", { key, name: label });
      const persisted = result.success;
      const newItem: TreeItem = {
        id: persisted ? (result.data as any).id : key,
        label,
        type: "organization",
        iconName: "Building2",
        metadata: {
          source: persisted ? "workspace.organizations" : "client_draft",
          key,
          persistenceError: persisted ? undefined : result.error?.message,
        },
        children: []
      };
      addTimelineEntry({
        type: persisted ? "audit" : "system",
        title: persisted ? `Created Organization: ${label}` : `Draft Organization: ${label}`,
        payload: { key, result: persisted ? "SUCCESS" : "LOCAL_DRAFT", error: result.error?.message },
      });
      setTreeData(addRecursive(treeData, parentId, newItem));
      setSelectedItem(newItem);
      return;
    }

    if (parent?.type === 'organization' || parentId.startsWith('workspaces-')) {
        const orgId = parent?.type === 'organization' ? parentId : parentId.replace('workspaces-', '');
        const key = createClientKey("ws");
        const label = "Novo Workspace";
        const result = await executeKernelAction("workspaces.create", { organizationId: orgId, key, name: label });
        const persisted = result.success;
        const workspaceId = persisted ? (result.data as any).id : key;
        const newItem: TreeItem = {
          id: workspaceId,
          label,
          type: "workspace",
          iconName: "Globe",
          metadata: {
            source: persisted ? "workspace.workspaces" : "client_draft",
            key,
            organizationId: orgId,
            persistenceError: persisted ? undefined : result.error?.message,
          },
          children: createWorkspaceGroups(workspaceId),
        };
        addTimelineEntry({
          type: persisted ? "audit" : "system",
          title: persisted ? `Provisioned Workspace: ${label}` : `Draft Workspace: ${label}`,
          payload: { orgId, key, result: persisted ? "SUCCESS" : "LOCAL_DRAFT", error: result.error?.message },
        });
        setTreeData(addRecursive(treeData, parentId, newItem));
        setActiveWorkspaceId(workspaceId);
        setSelectedItem(newItem);
        return;
    }

    if (parent?.type === 'group' || parent?.type === 'subgroup') {
        const newItem: TreeItem = {
          id: createClientKey("grp"),
          label: parent?.type === 'group' ? "Subgrupo" : "Novo Agrupamento",
          type: "subgroup",
          iconName: "Folder",
          children: []
        };
        setTreeData(addRecursive(treeData, parentId, newItem));
        setSelectedItem(newItem);
        return;
    }

    // Generic addition for other types
    const newItem: TreeItem = {
      id: createClientKey("new-item"),
      label: "Novo Componente",
      type: "process"
    };
    setTreeData(addRecursive(treeData, parentId, newItem));
    setSelectedItem(newItem);
  };

  const findItemRecursive = (items: TreeItem[], id: string): TreeItem | undefined => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemRecursive(item.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const createWorkspaceGroups = (workspaceId: string): TreeItem[] => [
    { id: `caps-${workspaceId}`, label: "Capacidades Instaladas", type: "group", iconName: "Layers", children: [] },
    { id: `procs-${workspaceId}`, label: "Processos de Negócio", type: "group", iconName: "Workflow", children: [] },
    { id: `flows-${workspaceId}`, label: "Automações (Flows)", type: "group", iconName: "Zap", children: [] },
    { id: `views-${workspaceId}`, label: "Telas e Formulários", type: "group", iconName: "Layout", children: [] },
    { id: `entities-${workspaceId}`, label: "Entidades Dinâmicas", type: "group", iconName: "Database", children: [] },
  ];

  const addRecursive = (items: TreeItem[], parentId: string, newItem: TreeItem): TreeItem[] => {
    return items.map(item => {
      if (item.id === parentId) {
        const existingChildren = (item.children || []).filter((child) => child.metadata?.source !== "empty" && child.id !== `${parentId}-empty`);
        return {
          ...item,
          children: [...existingChildren, newItem]
        };
      }
      return {
        ...item,
        children: item.children ? addRecursive(item.children, parentId, newItem) : undefined
      };
    });
  };

  const activateCapability = async (capability: TreeItem) => {
    const targetWorkspaceId = activeWorkspaceId;

    if (!targetWorkspaceId) {
      alert("Selecione ou crie um workspace antes de ativar uma capacidade.");
      return;
    }

    const result = await executeKernelAction("workspaces.install_capability", {
      workspaceId: targetWorkspaceId,
      capabilityKey: capability.metadata?.key || capability.id,
      name: capability.label
    });

    if (result.success || activeWorkspaceId?.startsWith("ws-")) {
      const persisted = result.success;
      addTimelineEntry({
        type: persisted ? "action" : "system",
        title: persisted ? `Capability Installed: ${capability.label}` : `Draft Capability: ${capability.label}`,
        payload: { workspaceId: targetWorkspaceId, capability: capability.metadata?.key, result: persisted ? "SUCCESS" : "LOCAL_DRAFT" }
      });
      const addRecursiveItems = (items: TreeItem[]): TreeItem[] => {
        return items.map(item => {
          if (item.id === `caps-${targetWorkspaceId}`) {
            const alreadyHas = item.children?.some(c => c.metadata?.key === capability.metadata?.key);
            if (alreadyHas) return item;

            return {
              ...item,
              children: [...(item.children || []), {
                 ...capability,
                 id: "installed-capability-" + (persisted ? ((result.data as any)?.id || capability.id) : capability.id),
                 type: "capability",
                 iconName: "Layers",
                 metadata: {
                  ...capability.metadata,
                  source: persisted ? "workspace_module_configs" : "client_draft",
                  workspaceId: targetWorkspaceId,
                  status: persisted ? (result.data as any)?.status : "draft",
                  layer: persisted ? (result.data as any)?.layer : capability.metadata?.layer,
                  persistenceError: persisted ? undefined : result.error?.message,
                 }
              }]
            };
          }
          return {
            ...item,
            children: item.children ? addRecursiveItems(item.children) : undefined
          };
        });
      };

      setTreeData(addRecursiveItems(treeData));
      alert(persisted
        ? `Capacidade "${capability.label}" instalada e habilitada no ambiente operacional!`
        : `Capacidade "${capability.label}" adicionada ao rascunho local.`
      );
    } else {
      alert(result.error?.message || "Não foi possível instalar a capability.");
    }
  };

  const updateItem = (id: string, updates: Partial<TreeItem>) => {
    const updateRecursive = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          if (selectedItem?.id === id) setSelectedItem(updated);
          return updated;
        }
        return {
          ...item,
          children: item.children ? updateRecursive(item.children) : undefined
        };
      });
    };
    setTreeData(updateRecursive(treeData));
  };

  const handlePublish = async () => {
    if (!activeWorkspaceId) {
      alert("Selecione ou crie um workspace antes de publicar.");
      return;
    }

    setIsPublishing(true);
    try {
      addTimelineEntry({ type: "system", title: "Publishing architectural changes...", payload: { target: activeWorkspaceId } });
      const result = await executeKernelAction("workspaces.publish", {
        workspaceId: activeWorkspaceId
      });
      if (result.success) {
        addTimelineEntry({ type: "system", title: "SUCCESS: Changes published to Runtime", payload: { status: "ACTIVE" } });
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 5000);
      }
    } catch {
      alert("Erro ao publicar workspace.");
    } finally {
      setIsPublishing(false);
    }
  };

  const selectItem = (item: TreeItem) => {
    setSelectedItem(item);
    if (item.type === "workspace") {
      setActiveWorkspaceId(item.id);
      return;
    }
    if (typeof item.metadata?.workspaceId === "string") {
      setActiveWorkspaceId(item.metadata.workspaceId);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Header - Platform Context */}
      <header className="flex h-12 items-center justify-between border-b px-4 shrink-0 bg-white z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shadow-sm">
              SB
            </div>
            <span className="text-sm font-bold tracking-tight">System Assembler</span>
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="flex items-center gap-3">
             <div className="text-[10px] font-mono text-muted-foreground uppercase px-2 py-0.5 border rounded bg-muted/30">
               Live Architect Session
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={cn(
              "px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-2 shadow-sm",
              publishSuccess ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
            )}
            data-testid="btn-publish-workspace"
          >
            {isPublishing ? <Loader2 className="size-3 animate-spin" /> : publishSuccess ? <CheckCircle2 className="size-3" /> : null}
            {isPublishing ? "Publishing..." : publishSuccess ? "Published to Runtime" : "Publish Workspace"}
          </button>
          <div className="size-8 rounded-full bg-muted border" title="Architect Profile" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex flex-1 overflow-hidden">
          <BuilderExplorer
            treeData={treeData}
            selectedId={selectedItem?.id}
            onSelect={selectItem}
            onRemove={removeItem}
            onAdd={addItem}
          />
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <BuilderCanvas
              activeItem={selectedItem}
              activeWorkspaceId={activeWorkspaceId}
              onUpdateItem={updateItem}
              onCreateChild={(parentId) => { void addItem(parentId); }}
            />

            {/* Timeline Panel */}
            <div className={cn(
              "absolute bottom-0 left-0 right-0 bg-background transition-all duration-300 ease-in-out border-t z-10",
              timelineExpanded ? "h-1/3" : "h-8"
            )}>
              {!timelineExpanded ? (
                <div
                  className="h-full flex items-center justify-between px-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setTimelineExpanded(true)}
                >
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Timeline Live</span>
                  </div>
                  <ChevronUp className="size-3 text-muted-foreground" />
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div
                    className="h-8 flex items-center justify-between px-4 border-b shrink-0 cursor-pointer bg-muted/20"
                    onClick={() => setTimelineExpanded(false)}
                  >
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Operational Memory</span>
                        <RefreshCw
                          className={cn("size-3 text-muted-foreground hover:text-primary transition-all", isRefreshingTimeline && "animate-spin")}
                          onClick={(e) => { e.stopPropagation(); refreshTimeline(); }}
                        />
                    </div>
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <BuilderTimeline entries={timelineEntries} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <BuilderInspector
            selectedItem={selectedItem}
            onUpdate={updateItem}
            onActivate={activateCapability}
            activeWorkspaceId={activeWorkspaceId}
          />
        </div>
      </div>
    </div>
  );
}
