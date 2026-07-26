import type { CancelBackAction, CancelBackResolution } from "@/platform/builder/contracts/cancel-back";
import type { OriginContext } from "@/platform/builder/contracts/origin-context/origin-context-contract";

export type HandleCancelBackArgs = {
  action: CancelBackAction;
  isDirty: boolean;
  moduleKey: string;
  originContext: OriginContext;
};

export async function resolveCancelBackViaApi(args: HandleCancelBackArgs): Promise<CancelBackResolution> {
  const response = await fetch("/api/builder/navigation/cancel-back", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error(`Cancel/Back resolution failed with status ${response.status}`);
  }

  return response.json();
}
