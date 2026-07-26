import React from 'react';
import { OriginContext } from '@/platform/builder/contracts/origin-context/origin-context-contract';

interface EnvironmentBadgeProps {
  context: OriginContext;
}

export function EnvironmentBadge({ context }: EnvironmentBadgeProps) {
  if (context.isDemo) {
    return (
      <span className="text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-1 rounded-md border border-orange-200 dark:border-orange-800 ml-3">
        DEMO MODE
      </span>
    );
  }

  if (context.isSynthetic) {
    return (
      <span className="text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800 ml-3">
        SYNTHETIC MODE
      </span>
    );
  }

  return null;
}
