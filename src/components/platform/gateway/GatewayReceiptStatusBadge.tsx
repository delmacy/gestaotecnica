import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/features/platform/gateway/agent-gateway.types";

export function GatewayReceiptStatusBadge({ status }: { status: SubmissionStatus }) {
  switch (status) {
    case "success":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Sucesso</Badge>;
    case "failed":
      return <Badge variant="destructive">Falha</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50 border-yellow-200">Pendente</Badge>;
    case "duplicate":
      return <Badge variant="secondary">Duplicado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
