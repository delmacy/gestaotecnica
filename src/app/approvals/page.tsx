import { resolveWorkspaceContext } from "@/platform/workspace";
import { listApprovalRequests } from "@/modules/approval-workflow/queries";
import { ApprovalRequestTable } from "@/modules/approval-workflow/components/ApprovalRequestTable";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const context = await resolveWorkspaceContext({ source: "ui" });
  const requests = await listApprovalRequests(context.workspaceId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Fluxos de Aprovação</h1>
      <ApprovalRequestTable requests={requests} />
    </div>
  );
}
