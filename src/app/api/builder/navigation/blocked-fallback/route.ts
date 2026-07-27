import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveBlockedFallback } from './resolve-blocked-fallback';
import { BlockedFallbackReasonSchema } from './blocked-fallback-contract';

const BlockedFallbackRequestSchema = z.object({
  reason: BlockedFallbackReasonSchema,
  originalPath: z.string().optional(),
  moduleName: z.string().optional(),
  workspaceId: z.string().optional(),
  environmentMode: z.enum(['real', 'demo', 'synthetic']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BlockedFallbackRequestSchema.parse(body);

    const destination = resolveBlockedFallback(parsed);

    return NextResponse.json({ destination });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid blocked fallback request' },
      { status: 400 }
    );
  }
}
