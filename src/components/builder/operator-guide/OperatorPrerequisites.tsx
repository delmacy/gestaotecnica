"use client";

import { OperatorPrerequisite } from "./operator-guide-types";

export function OperatorPrerequisites({
  prerequisites,
}: {
  prerequisites: OperatorPrerequisite[];
}) {
  if (!prerequisites || prerequisites.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-800 mb-2">Pré-requisitos</h3>
      <ul className="list-disc pl-5 space-y-1 text-slate-600">
        {prerequisites.map((req) => (
          <li key={req.id}>{req.description}</li>
        ))}
      </ul>
    </div>
  );
}
