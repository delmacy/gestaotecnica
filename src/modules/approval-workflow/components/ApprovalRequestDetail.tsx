import React from "react";
import { type ApprovalRequest, type ApprovalStep } from "../contracts";
import { DecisionForm } from "./DecisionForm";

export function ApprovalRequestDetail({
  request,
  steps,
  currentUserId
}: {
  request: ApprovalRequest,
  steps: ApprovalStep[],
  currentUserId: string
}) {
  const currentStep = steps.find(s => s.status === "pending");
  const canDecide = currentStep && currentStep.approverId === currentUserId;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{request.title}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{request.description}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.status}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Assunto</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{request.subjectType}: {request.subjectId}</dd>
          </div>
        </dl>
      </div>

      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900">Fluxo de Aprovação</h4>
        <div className="mt-4 space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className={`p-4 border rounded-lg ${step.status === "pending" ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}>
              <div className="flex justify-between">
                <span className="font-medium">Passo {idx + 1}: {step.approverId}</span>
                <span className="text-sm uppercase font-bold">{step.status}</span>
              </div>
              {step.decision && (
                <div className="mt-2 text-sm">
                  <p><strong>Decisão:</strong> {step.decision}</p>
                  {step.reason && <p><strong>Motivo:</strong> {step.reason}</p>}
                  <p className="text-xs text-gray-400">Decidido em: {step.decidedAt?.toLocaleString()}</p>
                </div>
              )}
              {step.status === "pending" && canDecide && (
                <div className="mt-4">
                  <DecisionForm requestId={request.id} stepId={step.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
