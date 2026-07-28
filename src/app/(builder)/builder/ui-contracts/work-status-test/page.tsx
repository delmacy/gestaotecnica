"use client";

import { useWorkStatus } from "@/components/builder/shared/hooks/useWorkStatus";
import { SuccessTransition } from "@/components/builder/shared/SuccessTransition";
import { Button } from "@/components/ui/button";

export default function WorkStatusTestPage() {
  const { resolution, triggerWorkStatus } = useWorkStatus();

  const handleCreateSuccess = () => {
    triggerWorkStatus({
      workId: "new-work-123",
      moduleKey: "work-items"
    });
  };

  const handleEmptyWork = () => {
    triggerWorkStatus({
      moduleKey: "work-items",
      isWorkEmpty: true
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Work Status Validation E2E Hooks</h1>

      <Button onClick={handleCreateSuccess} id="test-create-success">
        Trigger Create Success
      </Button>

      <Button onClick={handleEmptyWork} id="test-empty-work">
        Trigger Empty Work
      </Button>

      <SuccessTransition resolution={resolution} />
    </div>
  );
}
