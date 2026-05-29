import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Builder | Architecture Environment",
  description: "Ambiente de composição e arquitetura organizacional.",
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top Header - Global Platform Context */}
      <header className="flex h-12 items-center justify-between border-b px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shadow-sm">
              SB
            </div>
            <span className="text-sm font-bold tracking-tight">Platform Manager</span>
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="flex items-center gap-3">
            <select className="bg-transparent text-xs font-medium outline-none cursor-pointer hover:text-primary transition-colors">
              <option>All Organizations</option>
              <option>Acme Holding</option>
              <option>Stark Industries</option>
            </select>
            <span className="text-muted-foreground text-[10px]">/</span>
            <select className="bg-transparent text-xs font-medium outline-none cursor-pointer hover:text-primary transition-colors">
              <option>Global View</option>
              <option>Produção Brasil</option>
              <option>Logística Global</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-muted-foreground border px-2 py-0.5 rounded bg-muted/50">
            BUILDER MODE
          </div>
          <div className="size-8 rounded-full bg-muted border" />
        </div>
      </header>

      {/* Main Builder Area */}
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
