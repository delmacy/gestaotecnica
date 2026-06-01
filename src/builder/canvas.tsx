"use client";

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { ProcessBuilder } from '@/builder/specialized/process-builder';
import { FlowBuilder } from '@/builder/specialized/flow-builder';
import { OrganizationBuilder } from '@/builder/specialized/organization-builder';
import { CapabilityBuilder } from '@/builder/specialized/capability-builder';
import { ViewBuilder } from '@/builder/specialized/view-builder';
import { FormBuilder } from '@/builder/specialized/form-builder';
import { Box, Database } from "lucide-react";

export function BuilderCanvas({
  activeItem,
  activeWorkspaceId,
}: {
  activeItem: any;
  activeWorkspaceId: string | null;
}) {
  if (!activeItem) {
    return (
      <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col items-center justify-center text-center p-12">
        <div className="size-24 rounded-full bg-white border shadow-sm flex items-center justify-center mb-6">
          <Box className="size-10 text-muted-foreground/30" />
        </div>
        <h2 className="text-xl font-semibold text-foreground/80">System Assembler Canvas</h2>
        <p className="text-muted-foreground max-w-md mt-2">
          Selecione uma organização, capacidade ou processo no Explorer para iniciar a composição arquitetural.
        </p>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>
    );
  }

  // Switch between specialized builders
  const renderSpecializedBuilder = () => {
    switch (activeItem.type) {
      case 'organization':
      case 'workspace':
      case 'users':
      case 'roles':
      case 'integrations':
        return <OrganizationBuilder activeItem={activeItem} />;

      case 'capability':
      case 'catalog_item':
        return <CapabilityBuilder activeItem={activeItem} />;

      case 'process':
        return (
          <ReactFlowProvider>
            <ProcessBuilder activeItem={activeItem} activeWorkspaceId={activeWorkspaceId} />
          </ReactFlowProvider>
        );

      case 'flow':
        return (
          <ReactFlowProvider>
            <FlowBuilder activeItem={activeItem} activeWorkspaceId={activeWorkspaceId} />
          </ReactFlowProvider>
        );

      case 'view':
        // For simplicity, let's treat some views as forms in the assembler
        if (activeItem.id?.includes('form')) {
          return <FormBuilder activeItem={activeItem} activeWorkspaceId={activeWorkspaceId} />;
        }
        return <ViewBuilder activeItem={activeItem} activeWorkspaceId={activeWorkspaceId} />;

      case 'entity':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
             <Database className="size-12 text-muted-foreground/20 mb-4" />
             <h3 className="font-bold text-lg">{activeItem.label}</h3>
             <p className="text-sm text-muted-foreground">Entidade dinâmica registrada em {activeItem.metadata?.source}</p>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
             <Database className="size-12 text-muted-foreground/20 mb-4" />
             <h3 className="font-bold text-lg">Entidade Genérica</h3>
             <p className="text-sm text-muted-foreground">ID: {activeItem.id} | Tipo: {activeItem.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
       {renderSpecializedBuilder()}
    </div>
  );
}
