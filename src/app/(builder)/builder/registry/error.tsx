'use client';

import React, { useEffect } from 'react';
import { EmptyState } from '@/components/builder/shared/EmptyState';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <EmptyState
        icon={AlertTriangle}
        title="Ocorreu um erro ao carregar a página"
        description={error.message || "Não foi possível exibir esta página devido a um erro interno."}
        action={
          <Button variant="outline" onClick={() => reset()}>
            Tentar novamente
          </Button>
        }
      />
    </div>
  );
}
