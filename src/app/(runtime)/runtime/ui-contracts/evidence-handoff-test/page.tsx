import { EvidenceHandoffClient } from "./client";

export default function EvidenceHandoffTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Runtime Evidence Handoff Test</h1>
      <EvidenceHandoffClient />
    </div>
  );
}
