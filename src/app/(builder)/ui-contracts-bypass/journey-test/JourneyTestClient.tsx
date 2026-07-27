"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useJourneyLogic } from "@/components/builder/shared/hooks/useJourneyLogic";
import { JourneyResolution } from "@/platform/builder/contracts/journey-logic/journey-logic-contract";

export function JourneyTestClient() {
  const { executeJourneyAction, isLoading } = useJourneyLogic({
    journeyId: "test-journey",
    moduleKey: "test-module",
    currentStepId: "step-1",
  });

  const [result, setResult] = useState<JourneyResolution | null>(null);

  const testJourney = async (action: "START" | "NEXT_STEP" | "SAVE_DRAFT" | "COMPLETE" | "DISCARD", nextStepId?: string) => {
    try {
      const res = await executeJourneyAction(action, nextStepId);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-x-4">
        <Button id="btn-start" disabled={isLoading} onClick={() => testJourney("START", "step-1")}>Start Journey</Button>
        <Button id="btn-next" disabled={isLoading} onClick={() => testJourney("NEXT_STEP", "step-2")}>Next Step</Button>
        <Button id="btn-save" disabled={isLoading} onClick={() => testJourney("SAVE_DRAFT")}>Save Draft</Button>
        <Button id="btn-complete" disabled={isLoading} onClick={() => testJourney("COMPLETE")}>Complete</Button>
        <Button id="btn-discard" disabled={isLoading} variant="destructive" onClick={() => testJourney("DISCARD")}>Discard</Button>
      </div>
      {result && (
        <pre id="journey-result" className="p-4 bg-muted rounded-md overflow-auto max-w-lg">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
