"use client";

import React from "react";
import { UiContractGroup } from "./ui-contracts-types";
import { Search, X } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGroup: UiContractGroup | "all";
  setSelectedGroup: (group: UiContractGroup | "all") => void;
}

export function UiContractFilters({
  searchTerm,
  setSearchTerm,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  const groups: { value: UiContractGroup | "all"; label: string }[] = [
    { value: "all", label: "All Groups" },
    { value: "group_a_platform_foundation", label: "A - Platform" },
    { value: "group_b_builder_design", label: "B - Design" },
    { value: "group_c_runtime_integration", label: "C - Runtime" },
    { value: "group_d_client_real", label: "D - Client Real" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
          <div title="Search"><Search className="h-4 w-4" /></div>
        </div>
        <input
          type="text"
          placeholder="Search by name, route or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
          >
             <div title="Clear"><X className="h-4 w-4" /></div>
          </button>
        )}
      </div>

      <div className="flex bg-muted/50 p-1 rounded-lg border overflow-x-auto">
        {groups.map((g) => (
          <button
            key={g.value}
            onClick={() => setSelectedGroup(g.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              selectedGroup === g.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
