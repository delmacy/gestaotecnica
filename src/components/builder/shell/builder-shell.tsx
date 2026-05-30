"use client";

import { useState } from "react";
import { BuilderExplorer, TreeItem } from "@/components/builder/explorer";
import { BuilderCanvas } from "@/components/builder/canvas";
import { BuilderInspector } from "@/components/builder/inspector";

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

  const addItem = (parentId: string) => {
    const newItem: TreeItem = {
      id: "new-item-" + Date.now(),
      label: "Novo Componente",
      type: "process"
    };

    const addRecursive = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          };
        }
        return {
          ...item,
          children: item.children ? addRecursive(item.children) : undefined
        };
      });
    };
    setTreeData(addRecursive(treeData));
    setSelectedItem(newItem);
  };

  const activateCapability = (capability: TreeItem) => {
    // Find a workspace to add to (or prompt/use default)
    // For MVP: add to first workspace found or "Acme"
    const addRecursive = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === "capabilities-acme") {
          const alreadyHas = item.children?.some(c => c.metadata?.key === capability.metadata?.key);
          if (alreadyHas) return item;

          return {
            ...item,
            children: [...(item.children || []), {
               ...capability,
               id: "active-" + capability.id + "-" + Date.now(),
               type: "capability"
            }]
          };
        }
        return {
          ...item,
          children: item.children ? addRecursive(item.children) : undefined
        };
      });
    };

    setTreeData(addRecursive(treeData));
    alert(`Capacidade "${capability.label}" ativada no workspace!`);
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
