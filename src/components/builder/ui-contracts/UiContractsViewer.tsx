"use client";

import React, { useState, useMemo } from "react";
import { UiContractList } from "./UiContractList";
import { UiContractDetailPanel } from "./UiContractDetailPanel";
import { UiContractFilters } from "./UiContractFilters";
import { UiContractImplementationMatrix } from "./UiContractImplementationMatrix";
import { MOCK_UI_CONTRACTS_INDEX } from "./ui-contracts-data";
import { UiContractGroup } from "./ui-contracts-types";
import { AlertTriangle, LayoutTemplate, SearchX } from "lucide-react";
import { EmptyState } from "../shared/EmptyState";

export function UiContractsViewer() {
  const contracts = MOCK_UI_CONTRACTS_INDEX.contracts;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<UiContractGroup | "all">("all");
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    contracts.length > 0 ? contracts[0].id : null
  );
  const [activeTab, setActiveTab] = useState<"details" | "matrix">("details");

  // Filter Logic
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchGroup = selectedGroup === "all" || c.group === selectedGroup;
      const term = searchTerm.toLowerCase();
      const matchSearch =
        term === "" ||
        c.surface_name.toLowerCase().includes(term) ||
        c.surface_id.toLowerCase().includes(term) ||
        c.route_candidate.toLowerCase().includes(term);

      return matchGroup && matchSearch;
    });
  }, [contracts, searchTerm, selectedGroup]);

  const activeContract = contracts.find((c) => c.id === selectedContractId);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 flex items-center gap-3 text-yellow-800 dark:text-yellow-500 text-sm">
        <div title="Warning"><AlertTriangle className="h-5 w-5" /></div>
        <p>
          <strong>Read-only Static Index Mode:</strong> Esta interface exibe
          metadados indexados a partir de contratos estruturados estaticamente (mock).
          A edição de arquivos Markdown reais ou persistência de runtime está fora do
          escopo desta fase.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <UiContractFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />

        <div className="ml-4 flex bg-muted p-1 rounded-lg border">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "details"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("matrix")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "matrix"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Matrix
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "matrix" ? (
          <UiContractImplementationMatrix contracts={contracts} />
        ) : (
          <div className="flex h-full gap-6">
            {/* Sidebar */}
            <div className="w-1/3 min-w-[300px] border rounded-xl bg-background shadow-sm overflow-hidden flex flex-col">
              <div className="p-3 border-b bg-muted/20 font-semibold text-sm">
                Indexed Contracts ({filteredContracts.length})
              </div>
              <div className="flex-1 overflow-hidden p-2">
                 {filteredContracts.length === 0 ? (
                    <EmptyState
                        icon={SearchX}
                        title="Nenhum contrato encontrado"
                        description="Tente ajustar sua busca ou filtros."
                    />
                 ) : (
                    <UiContractList
                      contracts={filteredContracts}
                      selectedId={selectedContractId}
                      onSelect={setSelectedContractId}
                    />
                 )}
              </div>
            </div>

            {/* Main Detail Panel */}
            <div className="flex-1 min-w-0">
              {activeContract ? (
                <UiContractDetailPanel contract={activeContract} />
              ) : (
                <div className="h-full border rounded-xl bg-background shadow-sm flex flex-col items-center justify-center text-muted-foreground">
                  <EmptyState
                    icon={LayoutTemplate}
                    title="Nenhum contrato selecionado"
                    description="Selecione um contrato para visualizar os detalhes."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
