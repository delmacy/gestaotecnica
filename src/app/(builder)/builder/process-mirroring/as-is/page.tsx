import React from 'react';
import { AsIsMirrorBoard } from '@/components/builder/as-is-mirror/AsIsMirrorBoard';

export const metadata = {
  title: 'As-Is Mirror Board - System Builder',
};

export default function AsIsMirrorPage() {
  return (
    <div className="flex-1 p-6 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">As-Is Mirror Board</h1>
        <p className="text-slate-500 mt-2">
          Visualize mapped operational realities, gaps, and capabilities before building the target process.
        </p>
      </div>

      <div className="flex-1 min-h-[600px]">
        <AsIsMirrorBoard />
      </div>
    </div>
  );
}
