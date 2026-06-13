export type AccessProfile = "builder" | "admin" | "operador";

export function getDefaultRouteForProfile(profile: AccessProfile): string {
  switch (profile) {
    case "builder":
      return "/builder";
    case "admin":
    case "operador":
      return "/operations";
    default:
      return "/operations";
  }
}

export function canAccessRoute(profile: AccessProfile, pathname: string): boolean {
  const isBuilderRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/builder" ||
    pathname.startsWith("/builder/") ||
    pathname === "/skills" ||
    pathname === "/workspace-config";

  const isAdminRoute =
    pathname === "/operations" ||
    pathname.startsWith("/work-items") ||
    pathname.startsWith("/service-orders") ||
    pathname.startsWith("/planning") ||
    pathname.startsWith("/schedules") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/workforce") ||
    pathname.startsWith("/maintenance-plans") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/candidates") ||
    pathname.startsWith("/automations");

  const isOperatorRoute =
    pathname === "/operations" ||
    pathname.startsWith("/work-items") ||
    pathname.startsWith("/service-orders") ||
    pathname.startsWith("/schedules") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/documents");

  if (profile === "builder") {
    return isBuilderRoute || isAdminRoute || isOperatorRoute; // Typically builders have full access
  }

  if (profile === "admin") {
    return isAdminRoute || isOperatorRoute;
  }

  if (profile === "operador") {
    return isOperatorRoute;
  }

  return false;
}
