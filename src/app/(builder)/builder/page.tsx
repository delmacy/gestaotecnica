import { BuilderShell } from "@/components/builder/shell/builder-shell";
import { getCapabilityCatalog } from "@/platform/registry/infra/registry.queries";
import { ecosystemModules } from "@/platform/workspaces/module-catalog";

export const dynamic = "force-dynamic";

export default async function BuilderPage() {
  const capabilities = await getCapabilityCatalog();

  const mappedCapabilities = ecosystemModules.map(mod => ({
    id: "mod-" + mod.key,
    label: mod.name,
    type: "capability" as const,
    iconName: "Layers",
    metadata: {
      ...mod,
      modules: [mod.key],
      entities: [mod.key + "_record"],
      actions: ["create", "update", "delete"],
      events: [mod.key + ".created", mod.key + ".updated"],
    }
  }));

  const dbCapabilities = (capabilities || []).map((cap: any) => ({
    id: "registry-" + cap.id,
    label: cap.name,
    type: "catalog_item" as const,
    iconName: "Library",
    metadata: {
      ...cap,
      modules: [cap.key],
      entities: ["custom_entity"],
      actions: ["trigger", "notify"],
      events: ["event.fired"]
    },
  }));

  const initialTreeData: any[] = [
    {
      id: "orgs",
      label: "Organizações",
      iconName: "Building2",
      type: "group",
      children: [
        {
          id: "org-acme",
          label: "Acme Holding",
          type: "organization",
          iconName: "Building2",
          children: [
            {
              id: "workspace-acme-prod",
              label: "Produção Brasil",
              type: "workspace",
              iconName: "Globe",
              children: [
                { id: "users-acme", label: "Usuários", type: "users", iconName: "Users" },
                { id: "roles-acme", label: "Papéis (Roles)", type: "roles", iconName: "ShieldCheck" },
                { id: "ints-acme", label: "Integrações", type: "integrations", iconName: "Zap" },
                {
                  id: "caps-acme",
                  label: "Capacidades Instaladas",
                  type: "group",
                  iconName: "Layers",
                  children: mappedCapabilities.slice(0, 3)
                },
                {
                  id: "procs-acme",
                  label: "Processos de Negócio",
                  type: "group",
                  iconName: "Workflow",
                  children: [
                    { id: "proc-demand", label: "Atendimento de Demanda", type: "process", iconName: "Workflow" },
                  ]
                },
                {
                  id: "flows-acme",
                  label: "Automações (Flows)",
                  type: "group",
                  iconName: "Zap",
                  children: [
                    { id: "flow-auto-os", label: "Auto-geração de OS", type: "flow", iconName: "Zap" },
                  ]
                },
                {
                  id: "views-acme",
                  label: "Telas e Formulários",
                  type: "group",
                  iconName: "Layout",
                  children: [
                    { id: "view-board", label: "Quadro Operacional", type: "view", iconName: "Layout" },
                    { id: "view-form-demand", label: "Entrada de Demanda", type: "view", iconName: "FileText" },
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "catalog",
      label: "Capability Registry",
      iconName: "Library",
      type: "group",
      children: dbCapabilities
    }
  ];

  return <BuilderShell initialTreeData={initialTreeData} />;
}
