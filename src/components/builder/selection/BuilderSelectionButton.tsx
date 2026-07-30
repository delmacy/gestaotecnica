"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BuilderSelectionButton({
  organizationId,
  workspaceId,
  destination = "/builder",
  children,
}: {
  organizationId: string;
  workspaceId?: string;
  destination?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  function selectContext() {
    document.cookie = `x-organization-id=${organizationId}; path=/; samesite=lax`;
    if (workspaceId) {
      document.cookie = `x-workspace-id=${workspaceId}; path=/; samesite=lax`;
    } else {
      document.cookie = "x-workspace-id=; path=/; max-age=0; samesite=lax";
    }
    router.push(workspaceId ? destination : `/builder?organizationId=${organizationId}`);
    router.refresh();
  }

  return <Button onClick={selectContext}>{children}</Button>;
}
