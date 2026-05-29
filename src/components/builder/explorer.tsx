"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Box,
  Workflow,
  FileText,
  Zap,
  Settings,
  Database,
  Users,
  ShieldCheck,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Search, Copy, MoreVertical, LayoutTemplate, Building2 } from "lucide-react";

type TreeItem = {
  id: string;
  label: string;
  icon?: any;
  children?: TreeItem[];
  type?: "organization" | "workspace" | "capability" | "process" | "blueprint" | "action" | "group" | "template";
};

const BUILDER_TREE_DATA: TreeItem[] = [
  {
    id: "orgs",
    label: "Organizações",
    icon: Building2,
    type: "group",
    children: [
      {
        id: "org-acme",
        label: "Acme Holding",
        type: "organization",
        children: [
          {
            id: "workspace-acme-prod",
            label: "Produção Brasil",
            type: "workspace",
            children: [
              {
                id: "capabilities-acme",
                label: "Capacidades",
                icon: Box,
                type: "group",
                children: [
                  { id: "cap-finance", label: "Financeiro", type: "capability" },
                  { id: "cap-ops", label: "Operações", type: "capability" },
                ]
              },
              {
                id: "processes-acme",
                label: "Processos",
                icon: Workflow,
                type: "group",
                children: [
                  { id: "proc-buy", label: "Aprovação de Compra", type: "process" },
                ]
              },
            ]
          },
          {
            id: "workspace-acme-log",
            label: "Logística Global",
            type: "workspace",
          }
        ]
      },
      {
        id: "org-stark",
        label: "Stark Industries",
        type: "organization",
        children: [
          {
            id: "workspace-stark-rd",
            label: "R&D Lab",
            type: "workspace",
          }
        ]
      }
    ]
  },
  {
    id: "templates",
    label: "Templates",
    icon: LayoutTemplate,
    type: "group",
    children: [
      { id: "tmpl-erp-base", label: "ERP Foundation", type: "template" },
      { id: "tmpl-maint", label: "Maintenance Pack", type: "template" },
      { id: "tmpl-gov", label: "Governance Workflow", type: "template" },
    ]
  }
];

function TreeItemNode({ item, level = 0, onSelect, selectedId }: {
  item: TreeItem;
  level?: number;
  onSelect: (item: TreeItem) => void;
  selectedId?: string;
}) {
  const [isOpen, setIsOpen] = useState(level < 2);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon || (hasChildren ? Folder : FileText);
  const isSelected = selectedId === item.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-muted/50 rounded-sm transition-colors text-sm group",
          isSelected && "bg-muted text-primary font-medium"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          onSelect(item);
        }}
      >
        <div className="size-4 flex items-center justify-center">
          {hasChildren ? (
            isOpen ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />
          ) : null}
        </div>
        <Icon className={cn("size-3.5", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="truncate">{item.label}</span>
      </div>
      {hasChildren && isOpen && (
        <div className="mt-0.5">
          {item.children!.map(child => (
            <TreeItemNode
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BuilderExplorer({ onSelect, selectedId }: {
  onSelect: (item: TreeItem) => void;
  selectedId?: string;
}) {
  return (
    <aside className="w-72 border-r bg-card/50 flex flex-col shrink-0">
      <div className="h-10 flex items-center justify-between px-4 border-b shrink-0 bg-muted/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Platform Explorer</span>
        <div className="flex items-center gap-1">
          <div className="p-1 hover:bg-muted rounded cursor-pointer transition-colors" title="Duplicate selection">
            <Copy className="size-3 text-muted-foreground" />
          </div>
          <div className="p-1 hover:bg-muted rounded cursor-pointer transition-colors">
            <MoreVertical className="size-3 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="p-2 border-b">
        <div className="relative group">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search architecture..."
            className="w-full bg-background border rounded-md py-1.5 pl-7 pr-2 text-xs outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {BUILDER_TREE_DATA.map(item => (
          <div key={item.id}>
             <TreeItemNode
              item={item}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          </div>
        ))}
      </div>

      <div className="p-3 border-t bg-muted/10 shrink-0">
        <button className="w-full border border-dashed border-muted-foreground/30 rounded-md py-2 text-[10px] font-bold uppercase text-muted-foreground hover:bg-white hover:border-primary/50 hover:text-primary transition-all">
          + New Organization
        </button>
      </div>
    </aside>
  );
}
