"use client";

import React, { useState, useMemo } from 'react';
import { mockMatrices } from './governance-matrix-data';
import { GovernanceBlueprintList } from './GovernanceBlueprintList';
import { GovernanceRoleList } from './GovernanceRoleList';
import { GovernanceMatrixGrid } from './GovernanceMatrixGrid';
import { GovernancePermissionDetailPanel } from './GovernancePermissionDetailPanel';
import { GovernanceScopePanel } from './GovernanceScopePanel';
import { GovernanceApprovalPanel } from './GovernanceApprovalPanel';
import { GovernanceSegregationPanel } from './GovernanceSegregationPanel';
import { GovernanceConflictsPanel } from './GovernanceConflictsPanel';
import { GovernanceBindingsPanel } from './GovernanceBindingsPanel';
import { GovernanceAuditPanel } from './GovernanceAuditPanel';
import { AlertCircle } from 'lucide-react';
import { GovernancePermissionEffect, GovernanceScopeType, GovernancePermission } from './governance-matrix-types';

export function GovernanceMatrixStudio() {
  const [selectedMatrixId, setSelectedMatrixId] = useState<string | null>(mockMatrices[0]?.id || null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedPermissionId, setSelectedPermissionId] = useState<string | null>(null);

  // Custom Tabs state
  const [activeTab, setActiveTab] = useState<string>("permission");

  // Local state para simular changes (effect/scope) sem mutar DB
  const [simulatedPermissions, setSimulatedPermissions] = useState<Record<string, GovernancePermission>>({});

  const activeMatrix = useMemo(() => {
    if (!selectedMatrixId) return null;
    return mockMatrices.find(m => m.id === selectedMatrixId) || null;
  }, [selectedMatrixId]);

  // Aplica simulações locais à matriz ativa
  const matrixWithSimulations = useMemo(() => {
    if (!activeMatrix) return null;
    const newPerms = activeMatrix.permissions.map(p => {
      if (simulatedPermissions[p.id]) {
        return { ...p, ...simulatedPermissions[p.id] };
      }
      return p;
    });
    return { ...activeMatrix, permissions: newPerms };
  }, [activeMatrix, simulatedPermissions]);

  const activePermission = useMemo(() => {
    if (!matrixWithSimulations || !selectedPermissionId) return null;
    return matrixWithSimulations.permissions.find(p => p.id === selectedPermissionId) || null;
  }, [matrixWithSimulations, selectedPermissionId]);

  const handleSimulateEffect = (effect: GovernancePermissionEffect) => {
    if (!activePermission) return;
    setSimulatedPermissions(prev => ({
      ...prev,
      [activePermission.id]: { ...activePermission, effect }
    }));
  };

  const handleSimulateScope = (scope: GovernanceScopeType) => {
    if (!activePermission) return;
    setSimulatedPermissions(prev => ({
      ...prev,
      [activePermission.id]: { ...activePermission, scope }
    }));
  };

  const clearFilters = () => {
    setSelectedRoleId(null);
    setSelectedPermissionId(null);
  };

  if (!activeMatrix || !matrixWithSimulations) return <div>Loading Governance Matrix Studio...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50/50">

      {/* Left Sidebar - Blueprints & Roles */}
      <div className="w-64 flex-shrink-0 border-r bg-white flex flex-col h-full overflow-y-auto p-4 space-y-6">
        <GovernanceBlueprintList
          matrices={mockMatrices}
          selectedMatrixId={selectedMatrixId}
          onSelectMatrix={(id) => {
            setSelectedMatrixId(id);
            setSimulatedPermissions({});
            clearFilters();
          }}
        />
        <hr />
        <GovernanceRoleList
          roles={activeMatrix.roles}
          selectedRoleId={selectedRoleId}
          onSelectRole={(id) => setSelectedRoleId(prev => prev === id ? null : id)}
        />
      </div>

      {/* Main Content - Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30 overflow-hidden">
        {/* Banner Design Only */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center gap-2 text-blue-800 text-xs">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">Design-only / Not Enforced:</span>
          <span>Esta matriz é simulada client-side. Nenhuma regra de RBAC real ou permissão de banco está ativa.</span>
        </div>

        {/* Header and Controls */}
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{activeMatrix.name}</h2>
            <p className="text-xs text-slate-500">{activeMatrix.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {(selectedRoleId || selectedPermissionId || Object.keys(simulatedPermissions).length > 0) && (
              <button
                onClick={() => {
                  clearFilters();
                  setSimulatedPermissions({});
                }}
                className="text-xs text-slate-600 hover:text-slate-900 border px-2 py-1 rounded bg-white"
              >
                Clear Selection & Simulation
              </button>
            )}
          </div>
        </div>

        {/* Warnings Strip */}
        {activeMatrix.warnings && activeMatrix.warnings.length > 0 && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
            <div className="flex gap-2 text-xs text-yellow-800 items-start">
              <span className="font-semibold mt-0.5">Warnings:</span>
              <ul className="list-disc list-inside">
                {activeMatrix.warnings.map(w => (
                  <li key={w.id}>{w.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Grid Area */}
        <div className="flex-1 p-4 overflow-auto">
          <GovernanceMatrixGrid
            matrix={matrixWithSimulations}
            selectedPermissionId={selectedPermissionId}
            onSelectPermission={setSelectedPermissionId}
            filterRoleIds={selectedRoleId ? [selectedRoleId] : []}
          />
        </div>
      </div>

      {/* Right Sidebar - Detail Panels */}
      <div className="w-80 flex-shrink-0 border-l bg-white flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50">
          <h3 className="font-medium text-slate-800">Governance Details</h3>
          <p className="text-xs text-slate-500">
            {activePermission ? 'Detalhes da permissão selecionada.' : 'Selecione uma permissão na matriz.'}
          </p>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Custom Local Tabs Header */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("permission")}
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'permission' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Permission
            </button>
            <button
              onClick={() => setActiveTab("scope")}
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'scope' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Scope
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'rules' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Rules
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`flex-1 py-2 text-xs font-medium ${activeTab === 'audit' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Audit
            </button>
          </div>

          {/* Custom Local Tabs Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {activeTab === "permission" && (
              <div>
                {activePermission ? (
                  <GovernancePermissionDetailPanel
                    permission={activePermission}
                    onSimulateEffect={handleSimulateEffect}
                  />
                ) : (
                  <div className="text-sm text-slate-500 text-center py-8">Select a cell in the matrix to view permission details.</div>
                )}
              </div>
            )}

            {activeTab === "scope" && (
              <div>
                {activePermission ? (
                  <GovernanceScopePanel
                    permission={activePermission}
                    onSimulateScope={handleSimulateScope}
                  />
                ) : (
                  <div className="text-sm text-slate-500 text-center py-8">Select a cell in the matrix to view scope.</div>
                )}
              </div>
            )}

            {activeTab === "rules" && (
              <div className="space-y-6">
                <GovernanceApprovalPanel rules={activeMatrix.approval_rules} />
                <GovernanceSegregationPanel rules={activeMatrix.segregation_rules} />
                <GovernanceConflictsPanel conflicts={activeMatrix.conflicts} />
                <GovernanceBindingsPanel bindings={activeMatrix.bindings} />
              </div>
            )}

            {activeTab === "audit" && (
              <div>
                <GovernanceAuditPanel expectations={activeMatrix.audit_expectations} />
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
