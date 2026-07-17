"use client";

import { useState, useEffect } from "react";
import { OnboardingService } from "@/platform/onboarding/application/onboarding-service";
import { OnboardingEvidence } from "@/platform/onboarding/contracts/onboarding-evidence";

export default function AdminOnboardingPage() {
  const [evidences, setEvidences] = useState<OnboardingEvidence[]>([]);
  const [stepName, setStepName] = useState("");

  useEffect(() => {
    setEvidences(OnboardingService.getEvidences());
  }, []);

  const handleCompleteStep = () => {
    if (!stepName.trim()) return;

    const evidence = OnboardingService.saveEvidence({
      userId: "admin-user", // Simulated user ID
      stepCompleted: stepName,
      metadata: { browser: navigator.userAgent },
    });

    setEvidences((prev) => [...prev, evidence]);
    setStepName("");
  };

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Onboarding Flow</h1>

      <div className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Complete a Step</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={stepName}
            onChange={(e) => setStepName(e.target.value)}
            placeholder="e.g., Reviewed Policies"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            onClick={handleCompleteStep}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 whitespace-nowrap"
          >
            Mark Complete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Persisted Evidence</h2>
        {evidences.length === 0 ? (
          <p className="text-muted-foreground">No evidence recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {evidences.map((e) => (
              <li key={e.id} className="p-4 border rounded-md bg-muted/50 text-sm">
                <div className="font-medium">{e.stepCompleted}</div>
                <div className="text-xs text-muted-foreground">
                  User: {e.userId} &bull; Time: {new Date(e.timestamp).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground truncate" title={e.id}>
                  Evidence ID: {e.id}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
