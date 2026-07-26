"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { NextStepResolution } from "@/platform/builder/contracts/next-step/next-step-contract";

interface SuccessTransitionProps {
  resolution: NextStepResolution | null;
}

export function SuccessTransition({ resolution }: SuccessTransitionProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (resolution) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        router.push(resolution.destination);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
        setIsVisible(false);
    }
  }, [resolution, router]);

  if (!isVisible || !resolution) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-6 bg-card border rounded-lg shadow-lg space-y-4 max-w-sm w-full text-center">
        {resolution.status === "demo_simulation" || resolution.status === "blocked" ? (
           <div className="text-amber-500 mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
           </div>
        ) : (
          <div className="text-green-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
        )}
        <h3 className="text-lg font-semibold">{resolution.label}</h3>
        {resolution.message && (
          <p className="text-sm text-muted-foreground">{resolution.message}</p>
        )}
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
}
