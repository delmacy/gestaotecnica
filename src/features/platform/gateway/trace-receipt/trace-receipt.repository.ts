import { eq } from "drizzle-orm";
import { traceReceipts } from "@/db/runtime/schema/traceability";
import type { DbClient } from "@/db";
import type { TraceReceipt } from "@/platform/documents/traceability/contracts";

export interface TraceReceiptRepositoryPort {
  append(db: DbClient, receipt: TraceReceipt): Promise<void>;
  findById(db: DbClient, id: string): Promise<TraceReceipt | null>;
  findByCorrelationId(db: DbClient, correlationId: string): Promise<TraceReceipt[]>;
}

export const drizzleTraceReceiptRepository: TraceReceiptRepositoryPort = {
  async append(db: DbClient, receipt: TraceReceipt): Promise<void> {
    await db.insert(traceReceipts).values({
      id: receipt.id,
      workspaceId: receipt.workspaceId,
      subjectType: receipt.subject.type,
      subjectId: receipt.subject.id,
      correlationId: receipt.correlationId,
      previousReceiptId: receipt.previousReceiptId || null,
      causationId: receipt.causationId || null,
      data: receipt,
    });
  },

  async findById(db: DbClient, id: string): Promise<TraceReceipt | null> {
    const [record] = await db
      .select({ data: traceReceipts.data })
      .from(traceReceipts)
      .where(eq(traceReceipts.id, id))
      .limit(1);

    return record ? (record.data as TraceReceipt) : null;
  },

  async findByCorrelationId(db: DbClient, correlationId: string): Promise<TraceReceipt[]> {
    const records = await db
      .select({ data: traceReceipts.data })
      .from(traceReceipts)
      .where(eq(traceReceipts.correlationId, correlationId));

    return records.map((record: { data: unknown }) => record.data as TraceReceipt);
  },
};
