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
    <div className="bg-background text-foreground overflow-hidden">
      {children}
    </div>
  );
}
