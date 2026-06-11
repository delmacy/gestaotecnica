"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

const COMMON_CATEGORIES = [
  "manifest",
  "architecture",
  "decision",
  "tasker",
  "ui_contract",
  "capability",
  "registry"
];

export function DocsFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
}: DocsFiltersProps) {

  const hasActiveFilters = searchQuery !== "" || categoryFilter !== null;

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter(null);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border-b">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search docs by title, slug or path..."
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground mr-1">Categories:</span>
        <Button
          variant={categoryFilter === null ? "secondary" : "ghost"}
          size="sm"
          className="h-7 text-xs rounded-full"
          onClick={() => setCategoryFilter(null)}
        >
          All
        </Button>
        {COMMON_CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-xs rounded-full capitalize"
            onClick={() => setCategoryFilter(cat)}
          >
            {cat.replace("_", " ")}
          </Button>
        ))}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-muted-foreground ml-auto hover:text-foreground"
          >
            Clear <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}