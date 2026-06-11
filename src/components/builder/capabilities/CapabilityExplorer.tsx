"use client";

import React, { useState, useMemo } from "react";
import { MOCK_CAPABILITIES } from "./capability-data";
import {
  CapabilityCategory,
  CapabilityMvpPriority,
  CapabilityStatus,
  CapabilityItem
} from "./capability-types";
import { CapabilityCard } from "./CapabilityCard";
import { CapabilityFilters } from "./CapabilityFilters";
import { CapabilityDetailPanel } from "./CapabilityDetailPanel";
import { AlertCircle, FlaskConical } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function CapabilityExplorer() {
  const [capabilities, setCapabilities] = useState<CapabilityItem[]>(MOCK_CAPABILITIES);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CapabilityCategory | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<CapabilityMvpPriority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<CapabilityStatus | "all">("all");

  // Selection state
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);

  const selectedCapability = useMemo(() => {
    return capabilities.find(c => c.id === selectedCapabilityId) || null;
  }, [capabilities, selectedCapabilityId]);

  const filteredCapabilities = useMemo(() => {
    return capabilities.filter(cap => {
      const matchesSearch =
        searchTerm === "" ||
        cap.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cap.slug.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || cap.category === categoryFilter;
      const matchesPriority = priorityFilter === "all" || cap.mvp_priority === priorityFilter;
      const matchesStatus = statusFilter === "all" || cap.status === statusFilter;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [capabilities, searchTerm, categoryFilter, priorityFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  const handleRequestInstall = (id: string) => {
    setCapabilities(prev =>
      prev.map(cap =>
        cap.id === id
          ? { ...cap, install_state: 'simulated_requested' as const }
          : cap
      )
    );
  };

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto space-y-6">

      {/* Header & Warning */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Capability Explorer</h1>
          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            <FlaskConical className="w-3 h-3 mr-1" />
            Mock Data
          </span>
        </div>
        <p className="text-muted-foreground mb-4">
          Universal catalog of System Builder capabilities. Browse, inspect boundaries, and simulate requests.
        </p>

        <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">Synthetic/Mock Mode Active</AlertTitle>
          <AlertDescription className="text-amber-700/90 text-sm">
            This surface is currently using synthetic data. Actions such as "Request Install" will only simulate state changes locally. No actual workspace configuration, database records, or markdown files will be altered.
          </AlertDescription>
        </Alert>
      </div>

      {/* Filters */}
      <CapabilityFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onClear={handleClearFilters}
      />

      {/* Main Content Area */}
      {filteredCapabilities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-dashed shadow-sm">
          <FlaskConical className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No capabilities found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCapabilities.map(capability => (
            <div key={capability.id}>
              <CapabilityCard
                capability={capability}
                onClick={(cap) => setSelectedCapabilityId(cap.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      <CapabilityDetailPanel
        capability={selectedCapability}
        isOpen={selectedCapabilityId !== null}
        onClose={() => setSelectedCapabilityId(null)}
        onRequestInstall={handleRequestInstall}
      />

    </div>
  );
}
