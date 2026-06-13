import React from 'react';
import { Metadata } from 'next';
import { EnterpriseMapStudio } from '@/components/builder/enterprise-map/EnterpriseMapStudio';

export const metadata: Metadata = {
  title: 'Enterprise Map | System Builder',
  description: 'Design-only synthetic enterprise map',
};

export default function EnterpriseMapPage() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <EnterpriseMapStudio />
    </div>
  );
}
