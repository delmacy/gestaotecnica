export default async function TimelinePage({ params }: { params: Promise<{ workspaceKey: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Execution Timeline</h1>
      <p className="text-muted-foreground">
        Workspace: {resolvedParams.workspaceKey}
      </p>
    </div>
  );
}
