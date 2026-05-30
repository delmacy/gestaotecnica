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
  Search,
  Copy,
  MoreVertical,
  Building2,
  Trash2,
  Plus,
  History,
  Library,
  LayoutTemplate,
  Users,
  ShieldCheck,
  Globe,
  Layout,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TreeItem = {
  id: string;
  label: string;
  iconName?: string;
  icon?: any;
  children?: TreeItem[];
  type?:
    | "organization"
    | "workspace"
    | "users"
    | "roles"
    | "integrations"
    | "capability"
    | "process"
    | "flow"
    | "view"
    | "template"
    | "group"
    | "catalog_item";
  metadata?: any;
};

const IconMap: Record<string, any> = {
  Building2,
  Library,
  LayoutTemplate,
  Box,
  Workflow,
  Zap,
  History,
  Folder,
  FileText,
  Users,
  ShieldCheck,
  Globe,
  Layout,
  Layers
};

function TreeItemNode({ item, level = 0, onSelect, selectedId, onRemove, onAdd }: {
  item: TreeItem;
  level?: number;
  onSelect: (item: TreeItem) => void;
  selectedId?: string;
  onRemove?: (id: string) => void;
  onAdd?: (parentId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(level < 1);
  const hasChildren = item.children && item.children.length > 0;

  const Icon = (item.iconName && IconMap[item.iconName]) || item.icon || (hasChildren ? Folder : FileText);
  const isSelected = selectedId === item.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-muted/50 rounded-sm transition-colors text-sm group relative",
          isSelected && "bg-muted text-primary font-medium"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (hasChildren) setIsOpen(!isOpen);
          onSelect(item);
        }}
        data-testid={`tree-item-${item.id}`}
        data-label={item.label}
      >
        <div className="size-4 flex items-center justify-center">
          {hasChildren ? (
            isOpen ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />
          ) : null}
        </div>
        <Icon className={cn("size-3.5", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        <span className="truncate flex-1">{item.label}</span>

        {/* Inline Actions */}
        <div className="hidden group-hover:flex items-center gap-1">
          {onAdd && (item.type === 'group' || item.type === 'workspace' || item.type === 'organization') && (
            <Plus
              className="size-3 text-muted-foreground hover:text-primary action-add"
              onClick={(e) => { e.stopPropagation(); onAdd(item.id); }}
            />
          )}
          {onRemove && (item.type !== 'group' && item.type !== 'users' && item.type !== 'roles') && (
            <Trash2
              className="size-3 text-muted-foreground hover:text-destructive action-remove"
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
            />
          )}
        </div>
      </div>
      {hasChildren && isOpen && (
        <div className="mt-0.5 border-l ml-[15px] pl-[5px]">
          {item.children!.map(child => (
            <TreeItemNode
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              onRemove={onRemove}
              onAdd={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BuilderExplorer({ onSelect, selectedId, treeData, onRemove, onAdd }: {
  onSelect: (item: TreeItem) => void;
  selectedId?: string;
  treeData: TreeItem[];
  onRemove: (id: string) => void;
  onAdd: (parentId: string) => void;
}) {
  return (
    <aside className="w-72 border-r bg-card/50 flex flex-col shrink-0">
      <div className="h-10 flex items-center justify-between px-4 border-b shrink-0 bg-muted/20">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Assembler</span>
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
            placeholder="Search organizational model..."
            className="w-full bg-background border rounded-md py-1.5 pl-7 pr-2 text-xs outline-none focus:ring-1 focus:ring-primary transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {treeData.map(item => (
          <div key={item.id} className="mb-2">
             <TreeItemNode
              item={item}
              onSelect={onSelect}
              selectedId={selectedId}
              onRemove={onRemove}
              onAdd={onAdd}
            />
          </div>
        ))}
      </div>

      <div className="p-3 border-t bg-muted/10 shrink-0">
        <button
          onClick={() => onAdd('orgs')}
          className="w-full border border-dashed border-muted-foreground/30 rounded-md py-2 text-[10px] font-bold uppercase text-muted-foreground hover:bg-white hover:border-primary/50 hover:text-primary transition-all"
        >
          + New Organization
        </button>
      </div>
    </aside>
  );
}
