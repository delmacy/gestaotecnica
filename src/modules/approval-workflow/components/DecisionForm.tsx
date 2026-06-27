import React from "react";
import { submitDecision } from "../actions";

export function DecisionForm({ requestId, stepId }: { requestId: string, stepId: string }) {
  return (
    <form action={submitDecision} className="space-y-4">
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="stepId" value={stepId} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Decisão</label>
        <select name="decision" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="approve">Aprovar</option>
          <option value="reject">Rejeitar</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Motivo / Observação</label>
        <textarea name="reason" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
      </div>

      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Enviar Decisão
      </button>
    </form>
  );
}
