"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { PrimaryActionIntent } from "@/platform/builder/contracts/primary-action/primary-action-contract";

export interface PrimaryActionProps {
  intent: PrimaryActionIntent;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function PrimaryAction({ intent, className, size = "default", variant = "default" }: PrimaryActionProps) {
  const pathname = usePathname();

  if (intent.state === "hidden") {
    return null;
  }

  const isBlocked = intent.state === "blocked";

  if (isBlocked || !intent.href) {
    return (
        <div className="inline-block" title={intent.tooltipMessage}>
            <Button
              disabled={isBlocked}
              className={className}
              size={size}
              variant={variant}
              title={intent.tooltipMessage}
            >
              {intent.label}
            </Button>
        </div>
    );
  }

  // Safely append origin path to href
  const hasQuery = intent.href.includes("?");
  const separator = hasQuery ? "&" : "?";
  const hrefWithOrigin = `${intent.href}${separator}origin=${encodeURIComponent(pathname || "/")}`;

  return (
    <Button asChild size={size} variant={variant} className={className}>
      <Link href={hrefWithOrigin}>
        {intent.label}
      </Link>
    </Button>
  );
}
