import React from "react";
import type { NodePreviewProps } from "./index";

export function EndNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const completionStatus = (config.completionStatus as string) || "completed";
  const completionMessage = (config.completionMessage as string) || "Processo finalizado.";

  const isSuccess = completionStatus === "completed";
  const isRejected = completionStatus === "rejected";

  return (
    <div className="flex flex-col gap-3 items-center text-center py-6">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 shadow-sm ${
        isSuccess ? "bg-green-100 text-green-600 border border-green-200" :
        isRejected ? "bg-red-100 text-red-600 border border-red-200" :
        "bg-slate-100 text-slate-600 border border-slate-200"
      }`}>
        {isSuccess && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {isRejected && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {!isSuccess && !isRejected && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-800">{node.label}</h3>
      <p className="text-sm text-slate-500 font-medium capitalize">{completionStatus}</p>

      {completionMessage && (
        <p className="text-sm text-slate-700 bg-white p-3 rounded-md border border-slate-200 shadow-sm mt-4 max-w-sm">
          {completionMessage}
        </p>
      )}
    </div>
  );
}
