"use client";

import { useDeepLinkLanding } from "@/components/builder/shared/hooks/useDeepLinkLanding";
import { DeepLinkLandingHandler } from "@/components/builder/shared/DeepLinkLandingHandler";
import { Button } from "@/components/ui/button";

export default function DeepLinkLandingTestPage() {
  const { resolution, handleDeepLink } = useDeepLinkLanding();

  const triggerUnauthenticated = () => {
    handleDeepLink({
      url: "/builder/capabilities/cap-123",
      hasSession: false,
    });
  };

  const triggerAuthorized = () => {
    handleDeepLink({
      url: "/builder/capabilities/cap-123",
      hasSession: true,
      userRole: "builder",
      entityExists: true,
    });
  };

  const triggerUnauthorized = () => {
    handleDeepLink({
      url: "/admin/settings",
      hasSession: true,
      userRole: "builder",
      entityExists: true,
    });
  };

  const triggerNotFound = () => {
    handleDeepLink({
      url: "/builder/capabilities/missing-cap",
      hasSession: true,
      userRole: "builder",
      entityExists: false,
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Deep Link Landing Validation E2E Hooks</h1>

      <Button onClick={triggerUnauthenticated} id="test-unauthenticated">
        Trigger Unauthenticated
      </Button>

      <Button onClick={triggerAuthorized} id="test-authorized">
        Trigger Authorized
      </Button>

      <Button onClick={triggerUnauthorized} id="test-unauthorized">
        Trigger Unauthorized
      </Button>

      <Button onClick={triggerNotFound} id="test-not-found">
        Trigger Not Found
      </Button>

      <DeepLinkLandingHandler resolution={resolution} />
    </div>
  );
}
