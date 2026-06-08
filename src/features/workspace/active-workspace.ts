import { TEMPORARY_CANDIDATES_WORKSPACE_ID } from '@/features/builder/candidates/constants';

/**
 * TODO: [ALPHA GAP] Mudar para o mecanismo real de Active Workspace.
 *
 * Atualmente o sistema ainda não possui um WorkspaceContext robusto,
 * então estamos utilizando este helper como ponte segura para Alpha,
 * evitando hardcodings múltiplos pelas telas.
 *
 * A Fase Corretiva 28C requer um "caminho seguro" que centralize essa chamada.
 */
export function getActiveWorkspaceId(): string {
  // Retorna temporário até o Auth/Workspace real ser implementado
  return TEMPORARY_CANDIDATES_WORKSPACE_ID;
}
