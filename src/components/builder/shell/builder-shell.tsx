"use client";

import { useState } from "react";
import { BuilderExplorer, TreeItem } from "@/components/builder/explorer";
import { BuilderCanvas } from "@/components/builder/canvas";
import { BuilderInspector } from "@/components/builder/inspector";
import { executeKernelAction } from "@/platform/actions/remote-actions";

export function BuilderShell({ initialTreeData }: { initialTreeData: TreeItem[] }) {
  const [selectedItem, setSelectedItem] = useState<TreeItem | null>(null);
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTreeData);

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
    // For demo, we always install into 'workspace-acme-prod'
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

  return (
    <>
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
    </>
  );
}
