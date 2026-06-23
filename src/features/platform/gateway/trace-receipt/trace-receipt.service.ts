import { v4 as uuidv4 } from "uuid";
import type { DbClient } from "@/db";
import type { TraceReceiptRepositoryPort } from "./trace-receipt.repository";
import { TraceReceiptSchema, createTraceHash } from "@/platform/documents/traceability";
import type {
  TraceReceipt,
  TraceReceiptSubject,
  TraceReceiptActor,
  TraceReceiptAction,
  TraceReceiptSource,
  TraceReceiptArtifact
} from "@/platform/documents/traceability";

export interface CreateTraceReceiptInput {
  workspaceId: string;
  subject: TraceReceiptSubject;
  actor: TraceReceiptActor;
  action: TraceReceiptAction;
  source: TraceReceiptSource;
  artifacts?: TraceReceiptArtifact[];
  correlationId?: string;
  previousReceiptId?: string;
  causationId?: string;
  metadata?: Record<string, unknown>;
}

export class TraceReceiptService {
  constructor(private readonly repository: TraceReceiptRepositoryPort) {}

  async createAndAppendReceipt(
    db: DbClient,
    input: CreateTraceReceiptInput
  ): Promise<TraceReceipt> {
    const timestamp = new Date().toISOString();
    const correlationId = input.correlationId || uuidv4();

    const payloadToHash = {
      workspaceId: input.workspaceId,
      subject: input.subject,
      actor: input.actor,
      action: input.action,
      timestamp,
      source: input.source,
      artifacts: input.artifacts || [],
      correlationId,
      previousReceiptId: input.previousReceiptId,
      causationId: input.causationId,
      metadata: input.metadata,
    };

    const hash = createTraceHash(payloadToHash, "sha256", "payload");

    const receiptData = {
      id: uuidv4(),
      workspaceId: input.workspaceId,
      subject: input.subject,
      actor: input.actor,
      action: input.action,
      timestamp,
      source: input.source,
      artifacts: input.artifacts || [],
      hashes: [hash],
      correlationId,
      previousReceiptId: input.previousReceiptId,
      causationId: input.causationId,
      metadata: input.metadata,
    };

    const receipt = TraceReceiptSchema.parse(receiptData);

    await this.repository.append(db, receipt);

    return receipt;
  }

  async getReceiptById(db: DbClient, id: string): Promise<TraceReceipt | null> {
    return this.repository.findById(db, id);
  }

  async getReceiptsByCorrelationId(db: DbClient, correlationId: string): Promise<TraceReceipt[]> {
    return this.repository.findByCorrelationId(db, correlationId);
  }
}
