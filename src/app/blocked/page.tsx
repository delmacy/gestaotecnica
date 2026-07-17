import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlockedPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role || "adequado";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-semibold mb-4 text-destructive">Access Blocked</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this section. Contact an admin to request the {role} role.
        </p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
