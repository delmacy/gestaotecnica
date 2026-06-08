import React from 'react';
import type { CandidateEvidenceViewModel } from './candidate-evidence-view-model';

interface CandidateSuggestedFormsProps {
  forms?: NonNullable<CandidateEvidenceViewModel['proposal']>['suggestedForms'];
}

export function CandidateSuggestedForms({ forms }: CandidateSuggestedFormsProps) {
  if (!forms || forms.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
          Formulários Sugeridos
        </h3>
        <p className="text-sm text-muted-foreground italic">Nenhum formulário sugerido.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        Formulários Sugeridos
      </h3>
      <div className="space-y-4">
        {forms.map((form) => (
          <details key={form.key} className="border rounded-md group bg-card overflow-hidden">
            <summary className="p-3 bg-muted/30 cursor-pointer font-medium text-sm flex justify-between items-center hover:bg-muted/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground transition-transform group-open:rotate-90">
                  ▶
                </span>
                <span>{form.title}</span>
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {form.key}
                </span>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {form.fields.length} {form.fields.length === 1 ? 'campo' : 'campos'}
              </span>
            </summary>

            <div className="p-0 border-t">
              <div className="grid grid-cols-12 gap-4 p-2 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                 <div className="col-span-4">Rótulo</div>
                 <div className="col-span-3">Chave</div>
                 <div className="col-span-3">Tipo</div>
                 <div className="col-span-2 text-center">Obrigatório</div>
              </div>
              <div className="divide-y text-sm">
                {form.fields.map((field) => (
                  <div key={field.key} className="grid grid-cols-12 gap-4 p-3 items-start hover:bg-muted/10">
                    <div className="col-span-4 font-medium">{field.label}</div>
                    <div className="col-span-3 font-mono text-xs text-muted-foreground">{field.key}</div>
                    <div className="col-span-3">
                      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">
                        {field.type}
                      </span>
                      {field.options && field.options.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                           <span className="font-semibold block mb-1">Opções:</span>
                           <ul className="list-disc pl-4 space-y-0.5">
                             {field.options.map((opt, i) => <li key={i}>{opt}</li>)}
                           </ul>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      {field.required ? (
                        <span className="text-green-600 font-bold">Sim</span>
                      ) : (
                        <span className="text-muted-foreground">Não</span>
                      )}
                    </div>
                  </div>
                ))}
                {form.fields.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground italic text-sm">
                    Nenhum campo definido para este formulário.
                  </div>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
