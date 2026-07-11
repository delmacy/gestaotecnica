export function isManifestVersionCompatible(requested: string, available: string): boolean {
  const requestedParts = requested.split('.');
  const availableParts = available.split('.');

  if (requestedParts.length === 0 || availableParts.length === 0) {
    return false;
  }

  return requestedParts[0] === availableParts[0];
}
