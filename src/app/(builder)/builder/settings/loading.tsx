import React from 'react';
import { EmptyState } from '@/components/builder/shared/EmptyState';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-full flex items-center justify-center">
      <EmptyState
        icon={Loader2}
        title="Carregando..."
        description="Por favor aguarde enquanto preparamos os dados."
      />
    </div>
  );
}
