"use server";

import { listGatewaySubmissions } from "./agent-gateway.repository";
import type { AgentGatewaySubmissionRecord } from "./agent-gateway.types";
import type { ListGatewaySubmissionsOptions } from "./gateway-receipts.types";

export type ActionResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export async function listGatewayReceiptsAction(
  options: ListGatewaySubmissionsOptions = {}
): Promise<ActionResponse<AgentGatewaySubmissionRecord[]>> {
  try {
    const submissions = await listGatewaySubmissions(options);
    return { ok: true, data: submissions };
  } catch (error: unknown) {
    console.error("Error fetching gateway receipts:", error);
    return {
      ok: false,
      error: {
        code: "FETCH_RECEIPTS_FAILED",
        message: "Não foi possível carregar os recibos do Agent Gateway.",
      },
    };
  }
}
