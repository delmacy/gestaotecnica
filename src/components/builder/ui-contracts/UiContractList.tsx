"use client";

import React from "react";
import { UiSurfaceContract } from "./ui-contracts-types";
import { FileCode2, Lock, Layout, Zap, CalendarClock } from "lucide-react";

interface Props {
  contracts: UiSurfaceContract[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function UiContractList({ contracts, selectedId, onSelect }: Props) {
  const getGroupIcon = (group: string) => {
    switch (group) {
      case "group_a_platform_foundation":
        return <div title="Platform Foundation"><Layout className="h-4 w-4 text-blue-500" /></div>;
      case "group_b_builder_design":
        return <div title="Builder Design"><FileCode2 className="h-4 w-4 text-purple-500" /></div>;
      case "group_c_runtime_integration":
        return <div title="Runtime"><Zap className="h-4 w-4 text-yellow-500" /></div>;
      case "group_d_client_real":
        return <div title="Client Real"><Lock className="h-4 w-4 text-red-500" /></div>;
      default:
        return <div title="Future"><CalendarClock className="h-4 w-4 text-gray-500" /></div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "ready_for_dev":
      case "ready_for_readiness":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200";
      case "documented":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (contracts.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground border rounded-lg bg-background">
        Nenhum contrato encontrado para os filtros atuais.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 overflow-y-auto pr-2">
      {contracts.map((contract) => (
        <button
          key={contract.id}
          onClick={() => onSelect(contract.id)}
          className={`flex flex-col text-left p-3 rounded-lg border transition-colors ${
            selectedId === contract.id
              ? "bg-primary/5 border-primary shadow-sm"
              : "bg-background hover:bg-muted/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {getGroupIcon(contract.group)}
              <span className="font-semibold text-sm">{contract.surface_name}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
             <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {contract.surface_id}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusColor(
                contract.implementation_status
              )}`}
            >
              {contract.implementation_status.replace(/_/g, " ")}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
