import { BuilderShell } from "@/components/builder/shell/builder-shell";
import { getCapabilityCatalog } from "@/platform/registry/infra/registry.queries";
import { ecosystemModules } from "@/platform/workspaces/module-catalog";

export const dynamic = "force-dynamic";

export default async function BuilderPage() {
  const capabilities = await getCapabilityCatalog();

  // Combine Static Ecosystem with DB Registry
  // Pass strings for icons to satisfy Server-Client boundary serialization
  const mappedCapabilities = ecosystemModules.map(mod => ({
    id: "mod-" + mod.key,
    label: mod.name,
    type: "capability" as const,
    metadata: mod,
    children: [
      { id: "mod-" + mod.key + "-actions", label: "Ações", type: "group" as const, iconName: "Zap" },
      { id: "mod-" + mod.key + "-flows", label: "Fluxos", type: "group" as const, iconName: "Workflow" },
      { id: "mod-" + mod.key + "-events", label: "Eventos", type: "group" as const, iconName: "History" },
    ]
  }));

  const dbCapabilities = (capabilities || []).map((cap: any) => ({
    id: "registry-" + cap.id,
    label: cap.name,
    type: "catalog_item" as const,
    metadata: cap,
  }));

  const initialTreeData = [
    {
      id: "orgs",
      label: "Organizações",
      iconName: "Building2",
      type: "group" as const,
      children: [
        {
          id: "org-acme",
          label: "Acme Holding",
          type: "organization" as const,
          children: [
            {
              id: "workspace-acme-prod",
              label: "Produção Brasil",
              type: "workspace" as const,
              children: [
                {
                  id: "capabilities-acme",
                  label: "Capacidades Ativas",
                  iconName: "Box",
                  type: "group" as const,
                  children: mappedCapabilities.slice(0, 3)
                },
                {
                  id: "processes-acme",
                  label: "Processos",
                  iconName: "Workflow",
                  type: "group" as const,
                  children: [
                    { id: "proc-buy", label: "Aprovação de Compra", type: "process" as const },
                  ]
                },
              ]
            }
          ]
        }
      ]
    },
    {
      id: "catalog",
      label: "Catálogo de Capacidades",
      iconName: "Library",
      type: "group" as const,
      children: [
        ...mappedCapabilities.map(cap => ({ ...cap, type: "catalog_item" as const, children: undefined })),
        ...dbCapabilities
      ]
    },
    {
      id: "templates",
      label: "Templates de Sistema",
      iconName: "LayoutTemplate",
      type: "group" as const,
      children: [
        { id: "tmpl-base", label: "Base Template", type: "template" as const },
      ]
    }
  ];

  return <BuilderShell initialTreeData={initialTreeData} />;
}
