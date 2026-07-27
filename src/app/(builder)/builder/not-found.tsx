'use client';

import React from 'react';
import { EmptyState } from '@/components/builder/shared/EmptyState';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <EmptyState
        icon={FileQuestion}
        title="Configuration Unavailable"
        description="The requested resource could not be found."
        action={
          <Link href="/builder">
            <Button variant="outline">
              Return to Workspace
            </Button>
          </Link>
        }
      />
    </div>
  );
}
