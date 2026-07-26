import React from 'react';
import { resolveOriginContext } from '@/platform/builder/contracts/origin-context/resolve-origin-context';
import { resolveWorkspaceContext } from '@/platform/workspace';
import { cookies } from 'next/headers';
import { ContextualReturn } from '@/components/builder/shared/ContextualReturn';
import { EnvironmentBadge } from '@/components/builder/shared/EnvironmentBadge';

export default async function StartAnalysisPage({ searchParams }: { searchParams: Promise<{ origin?: string }> }) {
  const cookieStore = await cookies();
  const environmentMode = cookieStore.get('x-environment-mode')?.value as 'synthetic' | 'demo' | 'real' | undefined;
  const workspaceContext = await resolveWorkspaceContext({
    source: 'ui',
    ...(environmentMode ? { environmentMode } : {}),
  });

  const { origin } = await searchParams;

  const originContext = resolveOriginContext({
    workspaceContext,
    currentPath: '/builder/process-mirroring/new',
    originPath: origin || null,
    moduleKey: 'process-mirroring',
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Start Analysis
        <EnvironmentBadge context={originContext} />
      </h1>
      <p className="text-muted-foreground mb-6">Start a new process mirroring analysis. (Stub for validation)</p>

      <ContextualReturn context={originContext} />
    </div>
  );
}
