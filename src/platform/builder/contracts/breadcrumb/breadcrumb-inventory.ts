import { WorkspaceContext } from "@/platform/workspace";
import { resolveNavigationInventory } from "../navigation-inventory";

export interface BreadcrumbNode {
  label: string;
  href?: string;
  isClickable: boolean;
}

export interface BreadcrumbResolveOptions {
  pathname: string;
  dynamicLabels?: Record<string, string>;
  isNotFound?: boolean;
  isBlocked?: boolean;
}

export function resolveBreadcrumbInventory(
  context: WorkspaceContext,
  options: BreadcrumbResolveOptions
): BreadcrumbNode[] {
  const { pathname, dynamicLabels = {}, isNotFound = false, isBlocked = false } = options;
  const isPlatformAdmin = pathname.startsWith("/admin");
  const prefixPath = isPlatformAdmin ? "/admin" : "/builder";

  // Root node based on scope
  const nodes: BreadcrumbNode[] = [
    {
      label: isPlatformAdmin ? "Platform Admin" : "Workspace",
      href: prefixPath,
      isClickable: true,
    },
  ];

  if (!pathname || pathname === "/" || pathname === prefixPath) {
    return handleTerminalStates(nodes, isNotFound, isBlocked);
  }

  // Remove scope prefix for processing
  const pathWithoutPrefix = pathname.replace(new RegExp(`^${prefixPath}`), "");

  if (pathWithoutPrefix === "") {
    return handleTerminalStates(nodes, isNotFound, isBlocked);
  }

  const segments = pathWithoutPrefix.split("/").filter(Boolean);
  const inventory = resolveNavigationInventory(context);
  const modules = inventory.modules;

  // Process Level 1: Module Level
  if (segments.length > 0) {
    const moduleSegment = segments[0];
    const modulePath = `${prefixPath}/${moduleSegment}`;
    const moduleConfig = modules.find((m) => m.href === modulePath);

    if (moduleConfig) {
      nodes.push({
        label: moduleConfig.label,
        href: modulePath,
        isClickable: true,
      });
    } else {
      // Check if it's a known but unavailable module (e.g., coming soon or explicitly blocked)
      const futureConfig = inventory.futureModules.find((m) => m.href === modulePath);
      if (futureConfig) {
        nodes.push({
          label: futureConfig.label,
          isClickable: false,
        });
        // We stop here if the module is future/blocked, as deeper paths are moot
        return handleTerminalStates(nodes, isNotFound, isBlocked);
      } else {
        nodes.push({
          label: dynamicLabels[moduleSegment] || formatSegment(moduleSegment),
          href: modulePath,
          isClickable: true,
        });
      }
    }
  }

  // Handle deeper nested paths
  let currentPath = `${prefixPath}/${segments[0]}`;
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Resolve synthetic label or fallback to formatted segment
    let label = dynamicLabels[segment] || formatSegment(segment);

    // Handle mock synthetic indicator from context if missing dynamic label
    if (context.environmentMode === "synthetic" && !dynamicLabels[segment]) {
      label = `Mock ${label}`;
    }

    nodes.push({
      label: label,
      href: currentPath,
      isClickable: true,
    });
  }

  return handleTerminalStates(nodes, isNotFound, isBlocked);
}

function formatSegment(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function handleTerminalStates(
  nodes: BreadcrumbNode[],
  isNotFound: boolean,
  isBlocked: boolean
): BreadcrumbNode[] {
  // If we have no nodes, just return (shouldn't happen with our base logic)
  if (nodes.length === 0) return nodes;

  const terminalNodes = [...nodes];

  if (isNotFound) {
    terminalNodes[terminalNodes.length - 1] = {
      label: "Entity Not Found",
      isClickable: false,
    };
  } else if (isBlocked) {
    terminalNodes[terminalNodes.length - 1] = {
      label: "Restricted Area",
      isClickable: false,
    };
  } else {
    // Normal state - make the last node unclickable as it's the current page
    terminalNodes[terminalNodes.length - 1].isClickable = false;
  }

  return terminalNodes;
}
