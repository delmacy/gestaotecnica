"use client";

import { ViewType } from "./view-builder-types";
import {
  Table,
  LayoutList,
  KanbanSquare,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  Columns
} from "lucide-react";

interface ViewTypeSelectorProps {
  currentType: ViewType;
  onChange: (type: ViewType) => void;
}

const VIEW_TYPES: { type: ViewType; label: string; icon: React.ReactNode }[] = [
  { type: "table", label: "Table", icon: <Table className="w-4 h-4" /> },
  { type: "detail", label: "Detail", icon: <LayoutList className="w-4 h-4" /> },
  { type: "kanban", label: "Kanban", icon: <KanbanSquare className="w-4 h-4" /> },
  { type: "calendar", label: "Calendar", icon: <Calendar className="w-4 h-4" /> },
  { type: "timeline", label: "Timeline", icon: <Clock className="w-4 h-4" /> },
  { type: "dashboard_cards", label: "Dashboard", icon: <LayoutGrid className="w-4 h-4" /> },
  { type: "compact_list", label: "List", icon: <List className="w-4 h-4" /> },
  { type: "split_master_detail", label: "Split", icon: <Columns className="w-4 h-4" /> },
];

export function ViewTypeSelector({ currentType, onChange }: ViewTypeSelectorProps) {
  return (
    <div className="flex gap-2 p-4 border-b bg-white overflow-x-auto">
      {VIEW_TYPES.map(({ type, label, icon }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors border ${
            currentType === type
              ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div title={label}>{icon}</div>
          {label}
        </button>
      ))}
    </div>
  );
}
