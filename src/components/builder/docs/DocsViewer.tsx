"use client";

import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { STATIC_DOCS_INDEX } from "./docs-data";
import { DocsItem } from "./docs-types";
import { DocsFilters } from "./DocsFilters";
import { DocsItemCard } from "./DocsItemCard";
import { DocsDetailPanel } from "./DocsDetailPanel";

export function DocsViewer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return STATIC_DOCS_INDEX.filter((doc) => {
      // Search logic
      const matchesSearch =
        searchQuery === "" ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.source_path.toLowerCase().includes(searchQuery.toLowerCase());

      // Category logic
      const matchesCategory = categoryFilter === null || doc.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const selectedDoc = useMemo(() => {
    return STATIC_DOCS_INDEX.find((d) => d.id === selectedDocId) || null;
  }, [selectedDocId]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-background">
      <Alert variant="default" className="rounded-none border-x-0 border-t-0 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
        <AlertCircle className="h-4 w-4" color="currentColor" />
        <AlertTitle>Read Only Mode</AlertTitle>
        <AlertDescription>
          Docs Viewer is read-only and uses a static mock index. It does not parse live markdown files.
        </AlertDescription>
      </Alert>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Filters and List */}
        <div className="w-1/3 min-w-[320px] max-w-[400px] border-r flex flex-col bg-muted/10">
          <DocsFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {filteredDocs.length === 0 ? (
                <div className="text-center p-8 text-sm text-muted-foreground">
                  No documents found matching the filters.
                </div>
              ) : (
                filteredDocs.map((doc) => (
                  <DocsItemCard
                    key={doc.id}
                    item={doc}
                    isSelected={selectedDocId === doc.id}
                    onClick={(item) => setSelectedDocId(item.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel: Document Details */}
        <div className="flex-1 overflow-hidden bg-background">
          <DocsDetailPanel item={selectedDoc} />
        </div>
      </div>
    </div>
  );
}