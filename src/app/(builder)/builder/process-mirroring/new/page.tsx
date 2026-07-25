import React from 'react';
import Link from 'next/link';

export default function StartAnalysisPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Start Analysis</h1>
      <p className="text-muted-foreground mb-6">Start a new process mirroring analysis. (Stub for validation)</p>

      <div className="flex gap-4">
        <Link href="/builder/process-mirroring" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
          Cancel and Return
        </Link>
      </div>
    </div>
  );
}
