"use client";

import React from "react";
import { UiSurfaceContract } from "./ui-contracts-types";

interface Props {
  contracts: UiSurfaceContract[];
}

export function UiContractImplementationMatrix({ contracts }: Props) {
  const groups = [
    { id: "group_a_platform_foundation", label: "Group A: Platform Foundation" },
    { id: "group_b_builder_design", label: "Group B: Builder Design" },
    { id: "group_c_runtime_integration", label: "Group C: Runtime Integration" },
    { id: "group_d_client_real", label: "Group D: Client Real / GT" },
  ];

  return (
    <div className="bg-background rounded-xl border shadow-sm p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Implementation Matrix</h2>
        <p className="text-muted-foreground text-sm">
          Visão panorâmica do status de implementação arquitetural dividida pelos grupos de entrega do projeto.
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => {
          const groupContracts = contracts.filter((c) => c.group === group.id);

          return (
            <div key={group.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/30 p-4 border-b">
                <h3 className="font-semibold">{group.label}</h3>
                <span className="text-xs text-muted-foreground">{groupContracts.length} interfaces mapeadas</span>
              </div>
              <div className="p-4 bg-background">
                {groupContracts.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Nenhum contrato indexado neste grupo.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupContracts.map((contract) => {
                      const isReady = contract.implementation_status === 'implemented' || contract.implementation_status === 'approved';
                      const isBlocked = contract.implementation_status === 'blocked';
                      return (
                        <div
                          key={contract.id}
                          className={`p-3 rounded border text-sm flex flex-col gap-2 ${
                            isReady ? 'border-green-200 bg-green-50/30' :
                            isBlocked ? 'border-red-200 bg-red-50/30' : 'border-border'
                          }`}
                        >
                          <span className="font-medium truncate">{contract.surface_name}</span>
                          <div className="flex justify-between items-center mt-auto pt-2">
                             <span className="text-xs font-mono text-muted-foreground truncate max-w-[100px]">{contract.surface_id}</span>
                             <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                               isReady ? 'bg-green-100 text-green-800' :
                               isBlocked ? 'bg-red-100 text-red-800' : 'bg-muted text-muted-foreground'
                             }`}>
                               {contract.implementation_status.replace(/_/g, " ")}
                             </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
