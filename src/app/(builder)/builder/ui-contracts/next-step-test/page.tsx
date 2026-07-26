"use client";

import { useNextStep } from "@/components/builder/shared/hooks/useNextStep";
import { SuccessTransition } from "@/components/builder/shared/SuccessTransition";
import { Button } from "@/components/ui/button";

export default function NextStepTestPage() {
  const { resolution, triggerNextStep } = useNextStep();

  const handleCreateSuccess = () => {
    triggerNextStep({
      outcome: "CREATE_ENTITY_SUCCESS",
      moduleKey: "capabilities",
      entityId: "new-cap-123",
      originContext: {
        originPath: "/builder/capabilities",
        returnPath: "/builder/capabilities",
        returnLabel: "Return to capabilities",
        isBlocked: false,
        isDemo: false,
        isSynthetic: false,
        isValidScope: true
      }
    });
  };

  const handleBlockedSuccess = () => {
    triggerNextStep({
      outcome: "CREATE_ENTITY_SUCCESS",
      moduleKey: "capabilities",
      entityId: "new-cap-123",
      hasDestinationAccess: false,
      originContext: {
        originPath: "/builder/capabilities",
        returnPath: "/builder/capabilities",
        returnLabel: "Return to capabilities",
        isBlocked: false,
        isDemo: false,
        isSynthetic: false,
        isValidScope: true
      }
    });
  };

  const handleDemoSuccess = () => {
    triggerNextStep({
      outcome: "PROCESS_ANALYSIS_SUCCESS",
      moduleKey: "reports",
      originContext: {
        originPath: "/builder/reports",
        returnPath: "/builder/reports",
        returnLabel: "Return",
        isBlocked: false,
        isDemo: true,
        isSynthetic: false,
        isValidScope: true
      }
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Next-Step Journey Validation E2E Hooks</h1>

      <Button onClick={handleCreateSuccess} id="test-create-success">
        Trigger Create Success
      </Button>

      <Button onClick={handleBlockedSuccess} id="test-blocked-success">
        Trigger Blocked Destination
      </Button>

      <Button onClick={handleDemoSuccess} id="test-demo-success">
        Trigger Demo Success
      </Button>

      <SuccessTransition resolution={resolution} />
    </div>
  );
}
