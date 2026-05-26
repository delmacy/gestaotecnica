import { activeAdaptation } from "./active";

export function findByKey<T extends { key: string }>(
  items: readonly T[],
  key: string,
): T | undefined {
  return items.find((item) => item.key === key);
}

export function getDemandTypeConfig(key: string) {
  return findByKey(activeAdaptation.demandTypes, key);
}

export function getServiceOrderTypeConfig(key: string) {
  return findByKey(activeAdaptation.serviceOrderTypes, key);
}

export function getShiftTypeConfig(key: string) {
  return findByKey(activeAdaptation.shiftTypes, key);
}

export function getBusinessRoleConfig(key: string) {
  return findByKey(activeAdaptation.businessRoles, key);
}
