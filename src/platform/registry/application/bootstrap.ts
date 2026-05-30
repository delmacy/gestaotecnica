import { seedCapabilitiesFromEcosystem } from "./seed";

export async function bootstrapPlatformRegistry() {
  await seedCapabilitiesFromEcosystem();
}
