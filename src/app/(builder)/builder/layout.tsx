import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Builder | Architecture Environment",
  description: "Ambiente de composição e arquitetura organizacional.",
};

import { BuilderSidebar, BuilderTopbar } from "@/components/builder/shell";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <BuilderSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <BuilderTopbar />
        <main className="flex-1 relative overflow-hidden bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
