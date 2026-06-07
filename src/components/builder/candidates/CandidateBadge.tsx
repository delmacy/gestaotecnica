import React from 'react';
import { CandidateStatus } from '@/features/builder/candidates/candidate.types';

const statusConfig: Record<CandidateStatus, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  under_analysis: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  waiting_review: { label: 'Aguardando Revisão', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800 border-red-200' },
  published: { label: 'Publicado', color: 'bg-purple-100 text-purple-800 border-purple-200' },
};

export function CandidateBadge({ status }: { status: CandidateStatus }) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

export function OriginBadge({ origin }: { origin: 'agent' | 'manual' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${origin === 'agent' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      {origin === 'agent' ? '🤖 Agente' : '👤 Manual'}
    </span>
  );
}
