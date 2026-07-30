import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/modules/auth/session";
import type { AccessProfile } from "@/modules/auth/access-profiles";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "System Builder Platform",
  description: "Plataforma modular para montar sistemas operacionais por workspace.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, cookieStore] = await Promise.all([getCurrentUser(), cookies()]);
  const navigationContext = {
    profile: (user?.accessProfile ?? "operador") as AccessProfile,
    organizationId: cookieStore.get("x-organization-id")?.value,
    workspaceId: cookieStore.get("x-workspace-id")?.value,
  };

  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body>
        <AppShell navigationContext={navigationContext}>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
