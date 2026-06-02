import React from "react";
import type { NodePreviewProps } from "./index";

export function DocumentNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const templateId = (config.templateId as string) || "nenhum";
  const documentName = (config.documentName as string) || "Documento Gerado";
  const outputMode = (config.outputMode as string) || "attach";
  const requireTraceReceipt = config.requireTraceReceipt !== false;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mt-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-12 bg-white border-2 border-slate-300 rounded shadow-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">{documentName}</span>
            <span className="text-xs text-slate-500 font-mono mt-0.5">Template: {templateId}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-xs">
          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded capitalize">{outputMode}</span>
          {requireTraceReceipt && (
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">+ Trace Receipt</span>
          )}
        </div>
      </div>
    </div>
  );
}
