"use client";

import React, { useState, useMemo } from "react";
import { MOCK_CAPABILITIES } from "@/platform/capabilities/mock-data/capability-data";
import {
  CapabilityCategory,
  CapabilityMvpPriority,
  CapabilityStatus,
  CapabilityItem
} from "./capability-types";
import { CapabilityCard } from "./CapabilityCard";
import { CapabilityFilters } from "./CapabilityFilters";
import { CapabilityDetailPanel } from "./CapabilityDetailPanel";
import { AlertCircle, Boxes, FilterX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/builder/shared/EmptyState";

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

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Capabilities globais</h1>
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
            <Boxes className="w-3 h-3 mr-1" />
            Catalogo reutilizavel
          </span>
        </div>
        <p className="text-muted-foreground mb-4">
          Catalogo universal de dominios, entidades, processos e eventos que podem ser instalados nos workspaces dos clientes.
        </p>

        <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 font-semibold">Catalogo base em consolidacao</AlertTitle>
          <AlertDescription className="text-amber-700/90 text-sm">
            Esta superficie apresenta capabilities globais reutilizaveis. As instalacoes por workspace ainda passam pelo fluxo controlado antes de alterar configuracao, banco de dados ou arquivos publicados.
          </AlertDescription>
        </Alert>
      </div>

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

      {filteredCapabilities.length === 0 ? (
        <EmptyState
          icon={FilterX}
          title="Nenhuma capability encontrada"
          description="Ajuste a busca ou os filtros para localizar outro dominio reutilizavel."
          action={
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
          }
        />
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

      <CapabilityDetailPanel
        capability={selectedCapability}
        isOpen={selectedCapabilityId !== null}
        onClose={() => setSelectedCapabilityId(null)}
        onRequestInstall={handleRequestInstall}
      />

    </div>
  );
}
