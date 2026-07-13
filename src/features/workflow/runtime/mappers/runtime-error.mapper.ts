import { RuntimeError, RuntimeErrorCode } from "../runtime.errors";
import { RuntimeDiagnosticEnvelope } from "../envelopes/runtime-diagnostic-envelope";

export interface PublicDiagnosticEnvelope {
  code: string;
  message: string;
  retryable: boolean;
  correlationId?: string;
  processId?: string;
  actionId?: string;
}

const ERROR_DICTIONARY: Record<RuntimeErrorCode, { message: string; retryable: boolean }> = {
  "INVALID_INPUT": { message: "Os dados fornecidos para o comando são inválidos.", retryable: false },
  "WORKSPACE_REQUIRED": { message: "Contexto de workspace não encontrado.", retryable: false },
  "WORKSPACE_MISMATCH": { message: "O recurso acessado não pertence ao seu espaço de trabalho.", retryable: false },
  "PROCESS_VERSION_NOT_FOUND": { message: "Versão de processo inatingível.", retryable: false },
  "PROCESS_VERSION_NOT_PUBLISHED": { message: "Este processo não possui versão ativada publicamente.", retryable: false },
  "PROCESS_VERSION_WORKSPACE_MISMATCH": { message: "Versão de processo não pertence ao workspace.", retryable: false },
  "INVALID_PROCESS_DEFINITION": { message: "Erro na estrutura publicável do motor.", retryable: false },
  "INITIAL_NODE_NOT_FOUND": { message: "O motor não conseguiu localizar o ponto inicial do fluxo.", retryable: false },
  "INSTANCE_NOT_FOUND": { message: "A instância solicitada não foi localizada.", retryable: false },
  "INSTANCE_NOT_ACTIVE": { message: "Esta instância de processo não está mais aguardando andamentos.", retryable: false },
  "ACTION_EXECUTION_NOT_FOUND": { message: "O passo de execução não pôde ser encontrado.", retryable: false },
  "ACTION_EXECUTION_NOT_ACTIVE": { message: "Este passo não se encontra mais em andamento.", retryable: false },
  "INVALID_STATE_TRANSITION": { message: "A transição de estado requisitada violou o gráfico do processo.", retryable: false },
  "AMBIGUOUS_TRANSITION": { message: "Ambiguidade na árvore de direções. Caminho não único.", retryable: false },
  "NO_VALID_TRANSITION": { message: "A engine chegou a uma aresta morta no diagrama.", retryable: false },
  "CONCURRENT_MODIFICATION": { message: "O recurso foi atualizado por outro processo simultâneo. Tente novamente.", retryable: true },
  "DUPLICATE_COMMAND": { message: "Este comando já foi processado pelo motor.", retryable: false },
  "PAYLOAD_VALIDATION_FAILED": { message: "Falha de validação dos dados atrelados à carga do nó.", retryable: false },
  "EVENT_WRITE_FAILED": { message: "Erro em logar dados no sistema.", retryable: true },
  "OUTBOX_WRITE_FAILED": { message: "Erro interno no barramento.", retryable: true },
  "INTERNAL_ERROR": { message: "Ocorreu um erro interno irrecuperável.", retryable: true },
};

export function mapRuntimeErrorToPublicDiagnostic(
  error: RuntimeError,
  diagnosticContext?: Partial<RuntimeDiagnosticEnvelope>
): PublicDiagnosticEnvelope {
  const dictionaryEntry = ERROR_DICTIONARY[error.code];

  if (!dictionaryEntry) {
    // Fallback for unknown error codes, mapped to INTERNAL_ERROR semantics
    const fallbackEntry = ERROR_DICTIONARY["INTERNAL_ERROR"];
    return {
      code: "INTERNAL_ERROR",
      message: fallbackEntry.message,
      retryable: fallbackEntry.retryable,
      correlationId: diagnosticContext?.correlationId,
      processId: diagnosticContext?.processId,
      actionId: diagnosticContext?.actionId,
    };
  }

  return {
    code: error.code,
    message: dictionaryEntry.message,
    retryable: dictionaryEntry.retryable,
    correlationId: diagnosticContext?.correlationId,
    processId: diagnosticContext?.processId,
    actionId: diagnosticContext?.actionId,
  };
}
