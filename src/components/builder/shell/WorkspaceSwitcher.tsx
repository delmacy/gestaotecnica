"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Building, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WorkspaceContext } from "@/platform/workspace";
import type { WorkspaceInfo, WorkspaceListResponse, WorkspaceSwitchingResponse } from "@/app/api/builder/navigation/workspace-switching-contract/workspace-switching-contract";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WorkspaceSwitcherProps {
  context: WorkspaceContext;
  className?: string;
}

export function WorkspaceSwitcher({ context, className }: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<WorkspaceInfo[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [switching, setSwitching] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const fetchWorkspaces = React.useCallback(async () => {
    if (!context.organizationId) {
      setError("Selecione uma organização antes de escolher um workspace.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        organizationId: context.organizationId,
        userId: context.actor.id || "anonymous",
      });
      const res = await fetch(`/api/builder/navigation/workspace-switching?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch workspaces");
      }
      const data: WorkspaceListResponse = await res.json();
      setWorkspaces(data.workspaces);
    } catch (err) {
      console.error(err);
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }, [context.actor.id, context.organizationId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && workspaces.length === 0 && !loading) {
      void fetchWorkspaces();
    }
  };

  const handleSwitch = async (workspace: WorkspaceInfo) => {
    if (workspace.workspaceId === context.workspaceId) return;
    if (!context.organizationId) {
      toast.error("Selecione uma organização antes de escolher um workspace.");
      return;
    }

    try {
      setSwitching(workspace.workspaceId);
      const res = await fetch("/api/builder/navigation/workspace-switching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentWorkspaceId: context.workspaceId || "sys",
          targetWorkspaceId: workspace.workspaceId,
          organizationId: context.organizationId,
          userId: context.actor.id || "anonymous",
        }),
      });

      if (!res.ok) {
        throw new Error("Switch request failed");
      }

      const data: WorkspaceSwitchingResponse = await res.json();

      if (data.status === "success" && data.redirectUrl) {
        router.push(data.redirectUrl);
        router.refresh();
      } else {
        toast.error("Access Denied", {
          description: data.message || "You do not have access to this workspace.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error", {
        description: "An unexpected error occurred while switching workspaces.",
      });
    } finally {
      setSwitching(null);
      setOpen(false);
    }
  };

  const currentWorkspaceName = workspaces.find((w) => w.workspaceId === context.workspaceId)?.name || context.workspaceId || "System Workspace";

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[220px] justify-between text-sm font-normal", className)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Building className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{currentWorkspaceName}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px] p-0" align="start">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading workspaces...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-4 text-sm text-destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              No other workspaces found.
            </div>
          ) : (
            <>
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                Available Workspaces
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.workspaceId}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSwitch(workspace);
                  }}
                  className="flex flex-col items-start gap-1 p-2 cursor-pointer"
                >
                  <div className="flex items-center w-full justify-between">
                    <span className="font-medium truncate flex-1">{workspace.name}</span>
                    {context.workspaceId === workspace.workspaceId && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                    {switching === workspace.workspaceId && (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                     <span className="text-muted-foreground capitalize">
                        {workspace.role.replace('_', ' ')}
                     </span>
                     {workspace.isSynthetic && (
                        <span className="text-[9px] bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-1 rounded uppercase font-semibold">
                          Synthetic
                        </span>
                     )}
                     {workspace.isDemo && (
                        <span className="text-[9px] bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1 rounded uppercase font-semibold">
                          Demo
                        </span>
                     )}
                  </div>
                </DropdownMenuItem>
              ))}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
