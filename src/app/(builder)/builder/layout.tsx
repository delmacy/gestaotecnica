import type { Metadata } from "next";
import { BuilderShell } from "@/components/builder/shell/BuilderShell";

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
    <BuilderShell>
      {children}
    </BuilderShell>
  );
}
