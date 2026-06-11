import React from 'react';
import GapTracker from '@/components/builder/gap-tracker/GapTracker';

export const metadata = {
  title: 'Gap Tracker | System Builder',
  description: 'Track and manage process mirroring gaps',
};

export default function GapTrackerPage() {
  return (
    <div className="h-[calc(100vh-56px)]">
      <GapTracker />
    </div>
  );
}
