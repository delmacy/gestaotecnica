import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AgentGatewaySubmissionRecord } from "@/features/platform/gateway/agent-gateway.types";
import { GatewayReceiptStatusBadge } from "./GatewayReceiptStatusBadge";
import { GatewayReceiptPayloadViewer } from "./GatewayReceiptPayloadViewer";

interface GatewayReceiptDetailProps {
  receipt: AgentGatewaySubmissionRecord | null;
  onClose: () => void;
}

export function GatewayReceiptDetail({ receipt, onClose }: GatewayReceiptDetailProps) {
  if (!receipt) return null;

  return (
    <Sheet open={!!receipt} onOpenChange={(open: boolean) => !open && onClose()}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Recibo</SheetTitle>
          <SheetDescription>
            Informações completas da submissão no Agent Gateway.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">Status</p>
              <div className="mt-1">
                <GatewayReceiptStatusBadge status={receipt.requestStatus} />
              </div>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Source</p>
              <p className="mt-1">{receipt.source}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Formato do Payload</p>
              <p className="mt-1">{receipt.payloadFormat}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Recebido em</p>
              <p className="mt-1">{new Date(receipt.receivedAt).toLocaleString()}</p>
            </div>
            {receipt.processedAt && (
              <div>
                <p className="font-semibold text-muted-foreground">Processado em</p>
                <p className="mt-1">{new Date(receipt.processedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-muted-foreground">ID da Submissão</p>
              <p className="mt-1 break-all font-mono">{receipt.id}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Correlation ID</p>
              <p className="mt-1 break-all font-mono">{receipt.correlationId}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Idempotency Key</p>
              <p className="mt-1 break-all font-mono">{receipt.idempotencyKey}</p>
            </div>

            {receipt.workspaceId && (
              <div>
                <p className="font-semibold text-muted-foreground">Workspace ID</p>
                <p className="mt-1 break-all font-mono">{receipt.workspaceId}</p>
              </div>
            )}

            {receipt.candidateId && (
              <div>
                <p className="font-semibold text-muted-foreground">Candidate ID</p>
                <p className="mt-1 break-all font-mono">{receipt.candidateId}</p>
                {/* Fallback copiable text as required when route doesn't exist yet */}
              </div>
            )}

            {(receipt.errorCode || receipt.errorMessage) && (
              <div className="rounded-md bg-destructive/10 p-4">
                <p className="font-semibold text-destructive">Erro na Submissão</p>
                {receipt.errorCode && <p className="mt-1 text-destructive font-mono text-xs">Code: {receipt.errorCode}</p>}
                {receipt.errorMessage && <p className="mt-1 text-destructive text-sm">{receipt.errorMessage}</p>}
              </div>
            )}
          </div>

          <div>
            <p className="font-semibold text-muted-foreground text-sm">Payload Sanitizado</p>
            <GatewayReceiptPayloadViewer payload={receipt.sanitizedPayload} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
