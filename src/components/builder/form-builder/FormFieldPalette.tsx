"use client";

import React from "react";
import {
  Type,
  AlignLeft,
  Hash,
  Calendar,
  Clock,
  List,
  CheckSquare,
  CircleDot,
  FileUp,
  Camera,
  PenTool,
  User,
  Box,
  BadgeInfo,
  Calculator
} from "lucide-react";

export function FormFieldPalette() {
  const commonFields = [
    { type: "text", label: "Short Text", icon: Type },
    { type: "textarea", label: "Long Text", icon: AlignLeft },
    { type: "number", label: "Number", icon: Hash },
    { type: "date", label: "Date", icon: Calendar },
    { type: "datetime", label: "Date & Time", icon: Clock },
    { type: "select", label: "Dropdown", icon: List },
    { type: "checkbox", label: "Checkbox", icon: CheckSquare },
    { type: "radio", label: "Radio Group", icon: CircleDot },
  ];

  const advancedFields = [
    { type: "file_placeholder", label: "File Upload", icon: FileUp },
    { type: "photo_placeholder", label: "Camera Photo", icon: Camera },
    { type: "signature_placeholder", label: "Signature", icon: PenTool },
  ];

  const relationFields = [
    { type: "user_reference_placeholder", label: "User Ref", icon: User },
    { type: "asset_reference_placeholder", label: "Asset Ref", icon: Box },
    { type: "status_badge", label: "Status Badge", icon: BadgeInfo },
    { type: "computed_placeholder", label: "Computed", icon: Calculator },
  ];

  const renderGroup = (title: string, items: typeof commonFields) => (
    <div className="mb-6">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              className="flex items-center gap-2 p-2 rounded border bg-background hover:bg-muted/50 transition-colors text-left text-xs"
              title="Mock - Drag and Drop not enabled in Design Phase"
            >
              <div className="p-1 rounded bg-muted/50 text-muted-foreground">
                <Icon className="h-3 w-3" />
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-4 overflow-y-auto h-full">
      <p className="text-xs text-muted-foreground mb-4 italic">
        Select a field type to add it to the canvas. (Simulated)
      </p>
      {renderGroup("Common Elements", commonFields)}
      {renderGroup("Advanced", advancedFields)}
      {renderGroup("Relations & System", relationFields)}
    </div>
  );
}
