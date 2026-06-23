
import { eq } from "drizzle-orm";
import { traceReceipts } from "@/db/runtime/schema/traceability";
import type { DbClient } from "@/db";
import { TraceReceiptSchema, type TraceReceipt } from "@/platform/documents/traceability/contracts";


export interface TraceReceiptRepositoryPort {
  append(db: DbClient, receipt: TraceReceipt): Promise<void>;
  findById(db: DbClient, id: string): Promise<TraceReceipt | null>;
  findByCorrelationId(db: DbClient, correlationId: string): Promise<TraceReceipt[]>;
}


function mapRecordToReceipt(record: { data: unknown }): TraceReceipt | null {
  if (!record || !record.data) return null;
  const result = TraceReceiptSchema.safeParse(record.data);
  return result.success ? result.data : null;
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

    return record ? mapRecordToReceipt(record) : null;
  },

  async findByCorrelationId(db: DbClient, correlationId: string): Promise<TraceReceipt[]> {
    const records = await db
      .select({ data: traceReceipts.data })
      .from(traceReceipts)
      .where(eq(traceReceipts.correlationId, correlationId));

    return records.map(mapRecordToReceipt).filter((r: unknown): r is TraceReceipt => r !== null);
  },
};
