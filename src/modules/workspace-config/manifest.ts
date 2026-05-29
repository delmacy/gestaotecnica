import type { ModuleManifest } from "@/platform/modules";

export const workspaceConfigManifest: ModuleManifest = {
  key: "workspace-config",
  name: "Workspace Configuration",
  description: "Configuracao operacional de modulos, catalogos e adaptacao ativa do workspace.",
  operational: {
    capability: "Configuracao de workspace",
    process: "Ativar capacidades, ajustar catalogos e preservar configuracoes por ambiente operacional.",
    result: "Workspace configurado sem acoplar a plataforma a um cliente especifico.",
    tracking: "Actions e eventos de alteracao de modulo/catalogo com ator e workspace.",
    evolution: "Pode evoluir para instalacao de blueprints, versionamento de configuracoes e auditoria de mudancas.",
    integrations: ["modules", "blueprints", "audit", "events"],
  },
  actions: ["workspace.toggle_module"],
  views: ["workspace.settings"],
};
