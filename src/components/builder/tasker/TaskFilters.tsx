import React from "react";
import { TaskGroup, TaskStatus } from "./tasker-types";
import { X } from "lucide-react";

interface TaskFiltersProps {
  groups: TaskGroup[];
  statuses: TaskStatus[];
  modules: string[];

  selectedGroup: TaskGroup | "all";
  selectedStatus: TaskStatus | "all";
  selectedModule: string | "all";

  onGroupChange: (group: TaskGroup | "all") => void;
  onStatusChange: (status: TaskStatus | "all") => void;
  onModuleChange: (module: string | "all") => void;
  onClearFilters: () => void;
}

export function TaskFilters({
  groups,
  statuses,
  modules,
  selectedGroup,
  selectedStatus,
  selectedModule,
  onGroupChange,
  onStatusChange,
  onModuleChange,
  onClearFilters
}: TaskFiltersProps) {

  const hasActiveFilters = selectedGroup !== "all" || selectedStatus !== "all" || selectedModule !== "all";

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 border-b bg-card">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Group</label>
        <select
          value={selectedGroup}
          onChange={(e) => onGroupChange(e.target.value as TaskGroup | "all")}
          className="text-sm border rounded p-1.5 bg-background min-w-[120px]"
        >
          <option value="all">All Groups</option>
          {groups.map(g => (
            <option key={g} value={g}>Group {g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">Status</label>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "all")}
          className="text-sm border rounded p-1.5 bg-background min-w-[120px] capitalize"
        >
          <option value="all">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">Module</label>
        <select
          value={selectedModule}
          onChange={(e) => onModuleChange(e.target.value)}
          className="text-sm border rounded p-1.5 bg-background min-w-[120px]"
        >
          <option value="all">All Modules</option>
          {modules.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 ml-2"
        >
          <X className="w-3 h-3" />
          Clear Filters
        </button>
      )}
    </div>
  );
}
