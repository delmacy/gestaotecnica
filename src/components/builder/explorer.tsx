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

type TreeItem = {
  id: string;
  label: string;
  icon?: any;
  children?: TreeItem[];
  type?: "workspace" | "capability" | "process" | "blueprint" | "action" | "group";
};

const BUILDER_TREE_DATA: TreeItem[] = [
  {
    id: "workspace-1",
    label: "Acme Corp",
    type: "workspace",
    children: [
      {
        id: "capabilities",
        label: "Capacidades",
        icon: Box,
        type: "group",
        children: [
          { id: "cap-finance", label: "Financeiro", type: "capability" },
          { id: "cap-rh", label: "RH", type: "capability" },
          { id: "cap-ops", label: "Operações", type: "capability" },
          { id: "cap-manutencao", label: "Manutenção", type: "capability" },
        ]
      },
      {
        id: "processes",
        label: "Processos",
        icon: Workflow,
        type: "group",
        children: [
          { id: "proc-buy", label: "Aprovação de Compra", type: "process" },
          { id: "proc-hire", label: "Admissão", type: "process" },
          { id: "proc-refund", label: "Reembolso", type: "process" },
          { id: "proc-preventiva", label: "Preventiva Automática", type: "process" },
        ]
      },
      {
        id: "blueprints",
        label: "Blueprints",
        icon: FileText,
        type: "group",
        children: [
          { id: "bp-so", label: "Ordem de Serviço", type: "blueprint" },
          { id: "bp-asset", label: "Ativo", type: "blueprint" },
          { id: "bp-work-item", label: "Demanda", type: "blueprint" },
        ]
      },
      {
        id: "forms",
        label: "Formulários",
        icon: FileText,
        type: "group",
      },
      {
        id: "actions",
        label: "Ações",
        icon: Zap,
        type: "group",
      },
      {
        id: "integrations",
        label: "Integrações",
        icon: Database,
        type: "group",
      },
      {
        id: "documents",
        label: "Documentos",
        icon: FileText,
        type: "group",
      },
      {
        id: "responsibilities",
        label: "Responsabilidades",
        icon: ShieldCheck,
        type: "group",
      },
      {
        id: "events",
        label: "Eventos",
        icon: History,
        type: "group",
      }
    ]
  }
];

function TreeItemNode({ item, level = 0, onSelect, selectedId }: {
  item: TreeItem;
  level?: number;
  onSelect: (item: TreeItem) => void;
  selectedId?: string;
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
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
    <aside className="w-64 border-r bg-card/50 flex flex-col shrink-0">
      <div className="h-10 flex items-center px-4 border-b shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explorer</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {BUILDER_TREE_DATA.map(item => (
          <TreeItemNode
            key={item.id}
            item={item}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
      </div>
    </aside>
  );
}
