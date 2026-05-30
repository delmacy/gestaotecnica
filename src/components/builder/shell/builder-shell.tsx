"use client";

import { useState } from "react";
import { BuilderExplorer, TreeItem } from "@/components/builder/explorer";
import { BuilderCanvas } from "@/components/builder/canvas";
import { BuilderInspector } from "@/components/builder/inspector";
import { executeKernelAction } from "@/platform/actions/remote-actions";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BuilderShell({ initialTreeData }: { initialTreeData: TreeItem[] }) {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTreeData);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

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
        const newItem: TreeItem = { id: (result.data as any).id, label, type: "organization", iconName: "Building2" };
        setTreeData(addRecursive(treeData, parentId, newItem));
        setSelectedItem(newItem);
      }
      return;
    }

    if (parent?.type === 'organization') {
        const key = "ws-" + Date.now();
        const label = "Novo Workspace";
        const result = await executeKernelAction("workspaces.create", { organizationId: parentId, key, name: label });
        if (result.success) {
          const newItem: TreeItem = { id: (result.data as any).id, label, type: "workspace", iconName: "Globe" };
          setTreeData(addRecursive(treeData, parentId, newItem));
          setSelectedItem(newItem);
        }
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
      // For demo, publish acme production workspace
      const result = await executeKernelAction("workspaces.publish", {
        workspaceId: "workspace-acme-prod"
      });
      if (result.success) {
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

      <div className="flex flex-1 overflow-hidden">
        <BuilderExplorer
          treeData={treeData}
          selectedId={selectedItem?.id}
          onSelect={(item) => setSelectedItem(item)}
          onRemove={removeItem}
          onAdd={addItem}
        />
        <BuilderCanvas activeItem={selectedItem} />
        <BuilderInspector
          selectedItem={selectedItem}
          onUpdate={updateItem}
          onActivate={activateCapability}
        />
      </div>
    </div>
  );
}
