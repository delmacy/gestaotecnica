"use client";

import React, { useState } from 'react';
import { mockSources } from './source-intake-data';
import { SourceInventoryList } from './SourceInventoryList';
import { SourceDetailPanel } from './SourceDetailPanel';
import { EvidenceListPanel } from './EvidenceListPanel';
import { ConsentStatusPanel } from './ConsentStatusPanel';
import { SensitivityReliabilityPanel } from './SensitivityReliabilityPanel';
import { SourceLimitationsPanel } from './SourceLimitationsPanel';
import { SourceConflictsPanel } from './SourceConflictsPanel';
import { SourceGapsPanel } from './SourceGapsPanel';

type Tab = 'evidences' | 'consent' | 'sensitivity' | 'limitations' | 'conflicts' | 'gaps';

export function SourceIntake() {
  const [selectedId, setSelectedId] = useState<string | null>(mockSources[0]?.id || null);
  const [activeTab, setActiveTab] = useState<Tab>('evidences');

  const selectedSource = mockSources.find(s => s.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-white text-black p-6">
      <div className="bg-yellow-100 text-yellow-800 p-3 mb-6 rounded border border-yellow-300 text-center font-bold">
        ⚠️ MOCK MODE ACTIVE - Synthetic Data Only. No DB Connections.
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-1/3">
          <SourceInventoryList
            sources={mockSources}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="w-2/3 flex flex-col gap-4 overflow-y-auto pr-2">
          {selectedSource ? (
            <>
              <SourceDetailPanel source={selectedSource} />

              <div className="border rounded bg-white mt-4 flex-1">
                <div className="flex border-b">
                  {(['evidences', 'consent', 'sensitivity', 'limitations', 'conflicts', 'gaps'] as Tab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 capitalize ${
                        activeTab === tab ? 'border-b-2 border-blue-500 font-bold text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-2">
                  {activeTab === 'evidences' && <EvidenceListPanel source={selectedSource} />}
                  {activeTab === 'consent' && <ConsentStatusPanel source={selectedSource} />}
                  {activeTab === 'sensitivity' && <SensitivityReliabilityPanel source={selectedSource} />}
                  {activeTab === 'limitations' && <SourceLimitationsPanel source={selectedSource} />}
                  {activeTab === 'conflicts' && <SourceConflictsPanel source={selectedSource} />}
                  {activeTab === 'gaps' && <SourceGapsPanel source={selectedSource} />}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 border rounded bg-gray-50">
              Select a source from the inventory
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
