import type { ModuleManifest } from "@/platform/modules";

export const inventoryManifest: ModuleManifest = {
  key: "inventory",
  name: "Inventory",
  description: "Controle de recursos materiais, saldos e movimentacoes ligadas a execucoes.",
  operational: {
    capability: "Gestao de recursos materiais",
    process: "Registrar itens, reservas, entradas, saidas e ajustes conectados ao contexto operacional.",
    result: "Saldo rastreavel por item, movimentacao, responsavel e execucao relacionada.",
    tracking: "Eventos de ajuste de estoque e historico de movimentacoes por workspace.",
    evolution: "Pode evoluir para lote, reserva, minimo operacional, compras e integracao com fornecedores.",
    integrations: ["service-orders", "acquisitions", "suppliers", "events"],
  },
  actions: ["inventory.adjust_stock"],
  events: ["inventory.stock_adjusted"],
  views: ["inventory.list", "inventory.detail"],
};
