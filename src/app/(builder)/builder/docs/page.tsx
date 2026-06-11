import { DocsViewer } from "@/components/builder/docs/DocsViewer";

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Docs Viewer</h1>
        <p className="text-muted-foreground">
          Explore the master documentation index for the System Builder architecture.
        </p>
      </div>

      <DocsViewer />
    </div>
  );
}