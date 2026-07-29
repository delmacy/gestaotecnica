"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resolveWorkStatusViaApi, type HandleWorkStatusArgs } from "@/components/builder/shared/actions/handle-work-status";
import type { WorkStatusResolution } from "@/platform/builder/contracts/work-status/work-status-contract";

export function useWorkStatus() {
    const router = useRouter();
    const [resolution, setResolution] = useState<WorkStatusResolution | null>(null);
    const [isResolving, setIsResolving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const resolveWorkStatus = useCallback(async (args: HandleWorkStatusArgs) => {
        setIsResolving(true);
        setError(null);
        try {
            const res = await resolveWorkStatusViaApi(args);
            setResolution(res);

            if (res.status === "blocked") {
                toast.error("Access Restricted", {
                    description: res.message || "You do not have permission to access this work.",
                });
            } else if (res.status === "demo") {
                toast.info("Demo Mode", {
                    description: res.message || "Work created locally.",
                });
            } else if (res.status === "empty") {
                toast.info("No Data", {
                    description: res.message || "No data was created.",
                });
            } else {
                toast.success("Success", {
                    description: res.message || "Work created successfully.",
                });
            }

            if (res.destination) {
                router.push(res.destination);
            }

            return res;
        } catch (err) {
            const e = err instanceof Error ? err : new Error("Failed to resolve work status");
            setError(e);
            console.error("Error resolving work status:", e);
            toast.error("An error occurred while resolving work status.");
            throw e;
        } finally {
            setIsResolving(false);
        }
    }, [router]);

    const clearWorkStatus = () => {
        setResolution(null);
    };

    return {
        resolution,
        isResolving,
        error,
        resolveWorkStatus,
        clearWorkStatus,
    };
}
