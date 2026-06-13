"use client";

import React from 'react';
import { GovernanceMatrix } from './governance-matrix-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Database, ShieldAlert, Zap } from 'lucide-react';

interface GovernanceBlueprintListProps {
  matrices: GovernanceMatrix[];
  selectedMatrixId: string | null;
  onSelectMatrix: (id: string) => void;
}

export function GovernanceBlueprintList({ matrices, selectedMatrixId, onSelectMatrix }: GovernanceBlueprintListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Blueprints de Governança</h3>
      <div className="flex flex-col gap-3">
        {matrices.map(matrix => (
          <Card
            key={matrix.id}
            className={`cursor-pointer transition-colors ${selectedMatrixId === matrix.id ? 'border-primary ring-1 ring-primary' : 'hover:border-slate-300'}`}
            onClick={() => onSelectMatrix(matrix.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  {matrix.name}
                </CardTitle>
                {selectedMatrixId === matrix.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
              <CardDescription>{matrix.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 text-xs">
                <Badge variant={matrix.data_source_mode === 'mock' ? 'outline' : 'secondary'} className="flex gap-1 items-center">
                  <Zap className="w-3 h-3" />
                  {matrix.data_source_mode}
                </Badge>
                {matrix.readiness_status !== 'mock_ready' && (
                  <Badge variant="destructive" className="flex gap-1 items-center">
                    <ShieldAlert className="w-3 h-3" />
                    {matrix.readiness_status}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
