import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OriginContext } from '@/platform/builder/contracts/origin-context/origin-context-contract';

interface ContextualReturnProps {
  context: OriginContext;
}

export function ContextualReturn({ context }: ContextualReturnProps) {
  if (!context.isValidScope) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/20 mt-6 max-w-2xl">
        <h3 className="font-semibold mb-2">Access Denied: Cross-Scope Boundary Alert</h3>
        <p className="text-sm">
          You have attempted to navigate across restricted platform boundaries (e.g., from Workspace to Admin).
          This action is blocked to preserve contextual integrity.
        </p>
        <div className="mt-4">
          <Button asChild variant="default">
            <Link href={context.returnPath || "/"}>{context.returnLabel || "Return Home"}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex gap-4">
      <Link
        href={context.returnPath || "/"}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
      >
        {context.returnLabel || "Return"}
      </Link>
    </div>
  );
}
