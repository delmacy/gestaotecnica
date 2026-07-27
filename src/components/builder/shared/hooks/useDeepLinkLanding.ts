import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeepLinkResolution } from "@/platform/builder/contracts/deep-link-landing/deep-link-landing-contract";

export function useDeepLinkLanding() {
  const [resolution, setResolution] = useState<DeepLinkResolution | null>(null);
  const router = useRouter();

  const handleDeepLink = async (request: unknown) => {
    try {
      const response = await fetch("/api/builder/navigation/deep-link-landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data: DeepLinkResolution = await response.json();
      setResolution(data);

      if (data.status === "unauthenticated" || data.status === "unauthorized" || data.status === "not_found") {
        router.push(data.targetUrl);
      } else {
        router.push(data.targetUrl);
      }
    } catch (error) {
      console.error("Deep link resolution failed", error);
    }
  };

  return { resolution, handleDeepLink };
}
