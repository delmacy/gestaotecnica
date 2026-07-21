import React from 'react';
import { EmptyState } from '@/components/builder/shared/EmptyState';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <EmptyState
        icon={Settings}
        title="Settings"
        description="Este módulo está sendo construído (Mock State)."
      />
    </div>
  );
}
