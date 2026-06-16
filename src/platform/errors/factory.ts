import {
  EntityId,
  ISODateTime,
  WorkspaceId,
  CorrelationId,
  CausationId,
} from "../contracts";
import { PlatformErrorEnvelope, PlatformErrorEnvelopeSchema } from "./schema";

/**
 * PlatformErrorContext - context provided by the platform for error creation.
 * Fields here are strictly controlled and must not be provided by the input.
 */
export interface PlatformErrorContext {
  id: EntityId;
  timestamp: ISODateTime;
  workspaceId?: WorkspaceId;
  correlationId?: CorrelationId;
  causationId?: CausationId;
}

/**
 * CreatePlatformErrorInput - input for creating a platform error.
 * Excludes fields that are managed by the context.
 */
export type CreatePlatformErrorInput = Omit<
  PlatformErrorEnvelope,
  | "id"
  | "timestamp"
  | "workspaceId"
  | "correlationId"
  | "causationId"
>;

/**
 * createPlatformError - pure and deterministic factory for PlatformErrorEnvelope.
 *
 * Rules:
 * 1. "id" comes exclusively from "context.id".
 * 2. "timestamp" comes exclusively from "context.timestamp".
 * 3. "workspaceId", "correlationId" and "causationId" come exclusively from context.
 * 4. The input cannot provide these fields (enforced by type and implementation).
 * 5. Returns a validated, frozen candidate.
 *
 * @param input - Error details (code, message, severity, etc.)
 * @param context - Platform-controlled identifiers and timing
 * @returns Validated PlatformErrorEnvelope
 */
export function createPlatformError(
  input: CreatePlatformErrorInput,
  context: PlatformErrorContext
): PlatformErrorEnvelope {
  // Monte um candidato novo de modo inequívoco, garantindo precedência do contexto
  const candidate = {
    ...input,
    id: context.id,
    timestamp: context.timestamp,
    workspaceId: context.workspaceId,
    correlationId: context.correlationId,
    causationId: context.causationId,
  };

  // Valide com o schema canônico (e remove campos desconhecidos devido ao .strict())
  const validated = PlatformErrorEnvelopeSchema.parse(candidate);

  // Funcione com objetos congelados (retornamos um novo objeto congelado para imutabilidade)
  return Object.freeze(validated);
}
