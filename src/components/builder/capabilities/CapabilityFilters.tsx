import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CapabilityCategory, CapabilityMvpPriority, CapabilityStatus } from "./capability-types";

interface CapabilityFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: CapabilityCategory | "all";
  setCategoryFilter: (category: CapabilityCategory | "all") => void;
  priorityFilter: CapabilityMvpPriority | "all";
  setPriorityFilter: (priority: CapabilityMvpPriority | "all") => void;
  statusFilter: CapabilityStatus | "all";
  setStatusFilter: (status: CapabilityStatus | "all") => void;
  onClear: () => void;
}

export function CapabilityFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  onClear
}: CapabilityFiltersProps) {

  const hasActiveFilters =
    searchTerm !== "" ||
    categoryFilter !== "all" ||
    priorityFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or slug..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-48">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Category</label>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as CapabilityCategory | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="foundation">Foundation</SelectItem>
            <SelectItem value="work-management">Work Management</SelectItem>
            <SelectItem value="relationship">Relationship</SelectItem>
            <SelectItem value="resource">Resource</SelectItem>
            <SelectItem value="information">Information</SelectItem>
            <SelectItem value="control">Control</SelectItem>
            <SelectItem value="intelligence">Intelligence</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">MVP Priority</label>
        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as CapabilityMvpPriority | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="future">Future</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Status</label>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as CapabilityStatus | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="documented">Documented</SelectItem>
            <SelectItem value="needs_review">Needs Review</SelectItem>
            <SelectItem value="ready_for_design">Ready for Design</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="future">Future</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClear}
          className="h-10 px-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" /> Clear
        </Button>
      )}
    </div>
  );
}
