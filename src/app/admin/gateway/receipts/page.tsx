import { Suspense } from "react";
import { Network } from "lucide-react";
import { listGatewayReceiptsAction } from "@/features/platform/gateway/agent-gateway.actions";
import { GatewayReceiptsTable } from "@/components/platform/gateway/GatewayReceiptsTable";
import { GatewayReceiptFilters } from "@/components/platform/gateway/GatewayReceiptFilters";
import type { AgentSource, PayloadFormat, SubmissionStatus } from "@/features/platform/gateway/agent-gateway.types";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    source?: string;
    format?: string;
    search?: string;
  }>;
}

export default async function GatewayReceiptsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const result = await listGatewayReceiptsAction({
    status: params.status as SubmissionStatus,
    source: params.source as AgentSource,
    payloadFormat: params.format as PayloadFormat,
    search: params.search,
  });

  const receipts = result.ok ? result.data : [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Network className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Agent Gateway Receipts</h1>
        </div>
        <p className="text-muted-foreground">
          Visualização read-only das submissões recebidas pelo Agent Gateway, incluindo correlation id, idempotency key, status, origem, formato do payload e payload sanitizado.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Suspense fallback={<div>Carregando filtros...</div>}>
          <GatewayReceiptFilters />
        </Suspense>

        {!result.ok ? (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="font-semibold">Erro ao carregar recibos</p>
            <p className="text-sm">{result.error.message}</p>
          </div>
        ) : (
          <GatewayReceiptsTable receipts={receipts} />
        )}
      </div>
    </div>
  );
}
