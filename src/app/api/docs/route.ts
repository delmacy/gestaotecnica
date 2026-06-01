import { NextResponse } from "next/server";

export async function GET() {
  const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "System Builder API",
      version: "1.0.0",
      description: "API de Integrações para o System Builder (n8n, Make, Webhooks externos)",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
      },
      {
        url: "https://seu-dominio.com",
        description: "Servidor de Produção",
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-gestaotecnica-api-key",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
      {
        BearerAuth: [],
      },
    ],
    paths: {
      "/api/integrations/commands": {
        post: {
          tags: ["Integrations"],
          summary: "Gateway de Comandos de Integração",
          description: "Endpoint unificado para receber comandos externos de sistemas como n8n, processar e rotear para as ações de negócio do Platform Kernel.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["workspaceId", "command", "payload"],
                  properties: {
                    workspaceId: {
                      type: "string",
                      description: "ID ou chave do Workspace de destino.",
                      example: "ws-12345",
                    },
                    command: {
                      type: "string",
                      description: "Identificador do comando/ação a ser executado.",
                      example: "work-items.create",
                    },
                    payload: {
                      type: "object",
                      description: "Dados de entrada necessários para a execução do comando.",
                      example: {
                        title: "Incidente reportado via n8n",
                        description: "Detalhes do incidente coletados do Jira",
                        type: "incidente"
                      },
                    },
                    idempotencyKey: {
                      type: "string",
                      description: "Chave única para garantir a idempotência do comando (evitar duplicidade).",
                      example: "idemp-req-9876",
                    },
                    source: {
                      type: "string",
                      description: "Sistema de origem da integração.",
                      example: "n8n",
                    }
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Comando recebido e processado (ou enfileirado) com sucesso.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "success",
                      },
                      message: {
                        type: "string",
                        example: "Integration command received and processed",
                      },
                      data: {
                        type: "object",
                        properties: {
                          commandId: {
                            type: "string",
                            example: "cmd-uuid-1234",
                          },
                          result: {
                            type: "object",
                            description: "Resultado da execução se síncrona",
                          }
                        }
                      }
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad Request - Erro de validação dos parâmetros",
            },
            "401": {
              description: "Unauthorized - Chave de API inválida",
            }
          },
        },
      },
    },
  };

  return NextResponse.json(swaggerDoc);
}
