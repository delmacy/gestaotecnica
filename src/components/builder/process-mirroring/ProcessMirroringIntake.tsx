"use client";

import React, { useState } from 'react';
import { mockPilots } from './process-mirroring-data';
import { ProcessPilotList } from './ProcessPilotList';
import { ProcessPilotDetail } from './ProcessPilotDetail';
import { EmptyState } from '../shared/EmptyState';
import { Search } from 'lucide-react';

export function ProcessMirroringIntake() {
  const [selectedPilotId, setSelectedPilotId] = useState<string | null>(mockPilots[0]?.id || null);

  const selectedPilot = mockPilots.find(p => p.id === selectedPilotId);

  return (
    <div className="flex h-full flex-col">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">Synthetic / Mock Mode</p>
        <p>This surface is currently operating in mock mode. No real sources are collected in this phase.</p>
      </div>

      <div className="flex flex-1 overflow-hidden border rounded-lg">
        <div className="w-1/3 border-r overflow-y-auto bg-slate-50">
          <ProcessPilotList
            pilots={mockPilots}
            selectedId={selectedPilotId}
            onSelect={setSelectedPilotId}
          />
        </div>
        <div className="w-2/3 overflow-y-auto bg-white p-6">
          {selectedPilot ? (
            <ProcessPilotDetail pilot={selectedPilot} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <EmptyState
                icon={Search}
                title="Nenhum piloto selecionado"
                description="Selecione um piloto para visualizar os detalhes"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
