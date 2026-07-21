import type { Metadata } from "next";
import { BuilderShell } from "@/components/builder/shell/BuilderShell";
import { resolveWorkspaceContext } from "@/platform/workspace";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "System Builder | Architecture Environment",
  description: "Ambiente de composição e arquitetura organizacional.",
};

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await resolveWorkspaceContext({ source: "ui" });

  return (
    <BuilderShell enabledModuleKeys={context.enabledModules}>
      {children}
    </BuilderShell>
  );
}
