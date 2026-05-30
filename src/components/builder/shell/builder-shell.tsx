"use client";

import { useState } from "react";
import { BuilderExplorer, TreeItem } from "@/components/builder/explorer";
import { BuilderCanvas } from "@/components/builder/canvas";
import { BuilderInspector } from "@/components/builder/inspector";
import { BuilderTimeline, TimelineEntry } from "@/components/builder/timeline/platform-timeline";
import { executeKernelAction } from "@/platform/actions/remote-actions";
import { Loader2, CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function BuilderShell({ initialTreeData }: { initialTreeData: TreeItem[] }) {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTreeData);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([
    { id: "1", type: "system", title: "Builder Session Initialized", timestamp: "Agora", payload: { user: "Architect", mode: "IDE" } },
    { id: "2", type: "action", title: "Organization Context Loaded", timestamp: "1m atrás", payload: { org: "Acme Holding" } },
  ]);

  const addTimelineEntry = (entry: Omit<TimelineEntry, "id" | "timestamp">) => {
    const newEntry: TimelineEntry = {
      ...entry,
      id: Date.now().toString(),
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
      const key = "org-" + Date.now();
      const label = "Nova Organização";

      const result = await executeKernelAction("organizations.create", { key, name: label });
      if (result.success) {
        addTimelineEntry({ type: "audit", title: `Created Organization: ${label}`, payload: { key, result: "SUCCESS" } });
        const newItem: TreeItem = {
          id: (result.data as any).id,
          label,
          type: "organization",
          iconName: "Building2",
          children: [
            { id: "groups-" + (result.data as any).id, label: "Estruturas e Grupos", type: "group", iconName: "Folder", children: [] },
            { id: "workspaces-" + (result.data as any).id, label: "Ambientes (Workspaces)", type: "group", iconName: "Globe", children: [] }
          ]
        };
        setTreeData(addRecursive(treeData, parentId, newItem));
        setSelectedItem(newItem);
      }
      return;
    }

    if (parent?.type === 'organization' || parentId.startsWith('workspaces-')) {
        const orgId = parent?.type === 'organization' ? parentId : parentId.replace('workspaces-', '');
        const key = "ws-" + Date.now();
        const label = "Novo Workspace";
        const result = await executeKernelAction("workspaces.create", { organizationId: orgId, key, name: label });
        if (result.success) {
          addTimelineEntry({ type: "audit", title: `Provisioned Workspace: ${label}`, payload: { orgId, key } });
          const newItem: TreeItem = { id: (result.data as any).id, label, type: "workspace", iconName: "Globe" };
          setTreeData(addRecursive(treeData, parentId, newItem));
          setSelectedItem(newItem);
        }
        return;
    }

    if (parent?.type === 'group' || parent?.type === 'subgroup') {
        const newItem: TreeItem = {
          id: "grp-" + Date.now(),
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
      id: "new-item-" + Date.now(),
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

  const addRecursive = (items: TreeItem[], parentId: string, newItem: TreeItem): TreeItem[] => {
    return items.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [...(item.children || []), newItem]
        };
      }
      return {
        ...item,
        children: item.children ? addRecursive(item.children, parentId, newItem) : undefined
      };
    });
  };

  const activateCapability = async (capability: TreeItem) => {
    const targetWorkspaceId = 'workspace-acme-prod';

    const result = await executeKernelAction("workspaces.install_capability", {
      workspaceId: targetWorkspaceId,
      capabilityKey: capability.metadata?.key || capability.id,
      name: capability.label
    });

    if (result.success) {
      addTimelineEntry({
        type: "action",
        title: `Capability Installed: ${capability.label}`,
        payload: { workspaceId: targetWorkspaceId, capability: capability.metadata?.key }
      });
      const addRecursiveItems = (items: TreeItem[]): TreeItem[] => {
        return items.map(item => {
          if (item.id === "caps-acme") {
            const alreadyHas = item.children?.some(c => c.metadata?.key === capability.metadata?.key);
            if (alreadyHas) return item;

            return {
              ...item,
              children: [...(item.children || []), {
                 ...capability,
                 id: "active-" + capability.id + "-" + Date.now(),
                 type: "capability",
                 iconName: "Layers"
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
      alert(`Capacidade "${capability.label}" instalada e habilitada no ambiente operacional!`);
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
    setIsPublishing(true);
    try {
      addTimelineEntry({ type: "system", title: "Publishing architectural changes...", payload: { target: "workspace-acme-prod" } });
      // For demo, publish acme production workspace
      const result = await executeKernelAction("workspaces.publish", {
        workspaceId: "workspace-acme-prod"
      });
      if (result.success) {
        addTimelineEntry({ type: "system", title: "SUCCESS: Changes published to Runtime", payload: { status: "ACTIVE" } });
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 5000);
      }
    } catch (e) {
      alert("Erro ao publicar workspace.");
    } finally {
      setIsPublishing(false);
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
            onSelect={(item) => setSelectedItem(item)}
            onRemove={removeItem}
            onAdd={addItem}
          />
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <BuilderCanvas activeItem={selectedItem} />

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
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Operational Memory</span>
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
          />
        </div>
      </div>
    </div>
  );
}
