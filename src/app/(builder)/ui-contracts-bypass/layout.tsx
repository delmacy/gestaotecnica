import React from 'react';
import { Toaster } from "@/components/ui/sonner";

export default function UiContractsBypassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
