"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { JourneyAction, JourneyResolution } from "@/platform/builder/contracts/journey-logic/journey-logic-contract";

export type UseJourneyLogicArgs = {
  journeyId: string;
  moduleKey: string;
  currentStepId?: string;
  isJourneyEmpty?: boolean;
  returnPath?: string;
  returnLabel?: string;
};

export function useJourneyLogic(args: UseJourneyLogicArgs) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const executeJourneyAction = async (action: JourneyAction, nextStepId?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/builder/navigation/journey-logic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // The contract expects specific headers for states, these could be passed if needed
        },
        body: JSON.stringify({
          action,
          journeyId: args.journeyId,
          moduleKey: args.moduleKey,
          currentStepId: args.currentStepId,
          nextStepId,
          isJourneyEmpty: args.isJourneyEmpty,
          returnPath: args.returnPath,
          returnLabel: args.returnLabel,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to execute journey action");
      }

      const resolution = (await res.json()) as JourneyResolution;

      // User-facing outcomes based on status
      if (resolution.status === "blocked") {
        toast.error("Access Restricted", {
          description: resolution.label,
        });
      } else if (resolution.status === "demo") {
         toast.info("Demo Mode", {
          description: "Simulating action, changes not saved.",
        });
      } else if (resolution.status === "synthetic") {
          // just standard success/info msg
      }

      // Show commercial message if provided
      if (resolution.message) {
        toast.success(resolution.label, {
          description: resolution.message,
        });
      }

      // Execute navigation
      if (resolution.destination) {
        router.push(resolution.destination);
      }

      return resolution;
    } catch (error) {
      console.error("Journey action failed:", error);
      toast.error("An error occurred during the journey.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeJourneyAction,
    isLoading,
  };
}
