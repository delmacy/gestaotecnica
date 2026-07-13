import { z } from 'zod';

/**
 * Gate E Readiness:
 * The Canonical Connector Boundary formalizes the inbound integration point
 * where external events (via gateways, webhooks, or n8n) are normalized into
 * a generic, semantic payload structure without requiring direct database integration.
 * This establishes structural readiness by ensuring that integrations do not execute
 * business logic but rather serve purely as a gateway.
 */

export const ConnectorBoundarySchema = z.object({
  /**
   * Represents the source of the boundary integration, e.g., 'n8n', 'webhook', 'api-gateway'.
   */
  sourceId: z.string().min(1),

  /**
   * The type of generic event crossing the boundary.
   */
  eventType: z.string().min(1),

  /**
   * The canonical payload that has been sanitized for internal domain processing.
   */
  payload: z.record(z.string(), z.unknown()),

  /**
   * A receipt or tracking ID generated immediately upon crossing the boundary.
   */
  gatewayReceiptId: z.string().min(1),

  /**
   * When the boundary was crossed.
   */
  receivedAt: z.string().datetime(),
});

export type ConnectorBoundary = Readonly<z.infer<typeof ConnectorBoundarySchema>>;
