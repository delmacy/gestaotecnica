import React from 'react';
import type { CandidateEvidenceViewModel } from './candidate-evidence-view-model';

interface CandidateAgentSummaryProps {
  agent?: CandidateEvidenceViewModel['agent'];
  confidenceScore?: number;
}

function getAgentSourceLabel(source?: string) {
  switch (source) {
    case 'paperclip': return 'Paperclip';
    case 'n8n': return 'n8n';
    case 'manual_api': return 'API manual';
    case 'unknown': return 'Desconhecido';
    default: return source || 'Desconhecida';
  }
}

function getAgentTypeLabel(type?: string) {
  switch (type) {
    case 'process_builder': return 'Agente construtor de processo';
    case 'form_builder': return 'Agente de formulário';
    case 'observation_agent': return 'Agente de observação';
    case 'unknown': return 'Tipo desconhecido';
    default: return type || 'Desconhecido';
  }
}

export function CandidateAgentSummary({ agent, confidenceScore }: CandidateAgentSummaryProps) {
  if (!agent) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        Origem da proposta
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-md border">
        <div>
          <span className="block text-muted-foreground mb-1">Fonte</span>
          <span className="font-medium">{getAgentSourceLabel(agent.source)}</span>
        </div>
        <div>
          <span className="block text-muted-foreground mb-1">Tipo</span>
          <span className="font-medium">{getAgentTypeLabel(agent.type)}</span>
        </div>
        {(agent.name || agent.version) && (
          <div className="col-span-2 flex gap-4 pt-2 border-t mt-2">
            {agent.name && (
              <div>
                <span className="block text-muted-foreground mb-1">Nome do Agente</span>
                <span className="font-medium">{agent.name}</span>
              </div>
            )}
            {agent.version && (
              <div>
                <span className="block text-muted-foreground mb-1">Versão</span>
                <span className="font-medium font-mono text-xs bg-muted px-1.5 py-0.5 rounded">v{agent.version}</span>
              </div>
            )}
          </div>
        )}
        {confidenceScore !== undefined && (
          <div className="col-span-2 pt-2 border-t mt-2">
             <span className="block text-muted-foreground mb-1">Confiança informada pelo agente</span>
             <span className="font-medium">{(confidenceScore * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
