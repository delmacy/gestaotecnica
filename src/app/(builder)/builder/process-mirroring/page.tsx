import React from 'react';
import { ProcessMirroringIntake } from '@/components/builder/process-mirroring/ProcessMirroringIntake';

export const metadata = {
  title: 'Process Mirroring Intake - System Builder',
};

export default function ProcessMirroringPage() {
  return (
    <div className="flex-1 p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Process Mirroring</h1>
        <p className="text-slate-500 mt-2">Manage process observation pilots and mirror operational realities.</p>
      </div>

      <div className="h-[calc(100vh-12rem)]">
        <ProcessMirroringIntake />
      </div>
    </div>
  );
}
