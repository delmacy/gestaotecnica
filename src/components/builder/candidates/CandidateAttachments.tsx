import React from 'react';
import type { CandidateEvidenceViewModel } from './candidate-evidence-view-model';

interface CandidateAttachmentsProps {
  attachments?: CandidateEvidenceViewModel['attachments'];
}

export function CandidateAttachments({ attachments }: CandidateAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Anexos
        </h3>
        <p className="text-sm text-muted-foreground italic">Nenhum anexo informado.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        Anexos
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="flex flex-col border rounded-md p-3 bg-card text-sm">
             <div className="font-medium truncate mb-1" title={attachment.name}>
               {attachment.name}
             </div>

             {attachment.mimeType && (
               <div className="text-xs text-muted-foreground mb-2 font-mono">
                 {attachment.mimeType}
               </div>
             )}

             {attachment.description && (
               <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                 {attachment.description}
               </p>
             )}

             <div className="mt-auto pt-2 border-t">
               {attachment.url ? (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Abrir anexo
                  </a>
               ) : (
                  <span className="text-xs text-muted-foreground italic">URL não disponível</span>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
