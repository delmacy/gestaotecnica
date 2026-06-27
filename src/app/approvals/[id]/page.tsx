import { notFound } from "next/navigation";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { getApprovalRequest, getApprovalSteps } from "@/modules/approval-workflow/queries";
import { ApprovalRequestDetail } from "@/modules/approval-workflow/components/ApprovalRequestDetail";

export const dynamic = "force-dynamic";

export default async function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const context = await resolveWorkspaceContext({ source: "ui" });

  const request = await getApprovalRequest(id, context.workspaceId);
  if (!request) notFound();

  const steps = await getApprovalSteps(id, context.workspaceId);

  return (
    <div className="container mx-auto py-8">
      <ApprovalRequestDetail
        request={request}
        steps={steps}
        currentUserId={context.actor.id!}
      />
    </div>
  );
}
