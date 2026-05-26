"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { eventLogs, supplierContracts, suppliers } from "@/db/schema";
import {
  contractStatuses,
  supplierStatuses,
  type ContractStatusValue,
  type SupplierStatusValue,
} from "./constants";

function readRequiredText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Campo obrigatorio ausente: ${field}`);
  return value;
}

function readOptionalText(formData: FormData, field: string) {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function readOptionalDate(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`Data invalida: ${field}`);
  return date;
}

function readOptionalInteger(formData: FormData, field: string) {
  const value = readOptionalText(formData, field);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) throw new Error(`Numero invalido: ${field}`);
  return parsed;
}

function readEnum<T extends string>(
  formData: FormData,
  field: string,
  allowedValues: readonly { value: T; label: string }[],
  fallback: T,
) {
  const value = String(formData.get(field) ?? fallback);
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export async function createSupplier(formData: FormData) {
  const name = readRequiredText(formData, "name");
  const status = readEnum<SupplierStatusValue>(formData, "status", supplierStatuses, "prospect");
  const db = getDb();
  const [supplier] = await db.insert(suppliers).values({
    name,
    status,
    documentNumber: readOptionalText(formData, "documentNumber"),
    contactName: readOptionalText(formData, "contactName"),
    contactEmail: readOptionalText(formData, "contactEmail"),
    contactPhone: readOptionalText(formData, "contactPhone"),
    category: readOptionalText(formData, "category"),
    notes: readOptionalText(formData, "notes"),
  }).returning({ id: suppliers.id, name: suppliers.name, status: suppliers.status });

  await db.insert(eventLogs).values({
    eventType: "supplier.created",
    entityType: "supplier",
    entityId: supplier.id,
    payload: supplier,
  });

  revalidatePath("/");
  revalidatePath("/suppliers");
  revalidatePath("/events");
  redirect("/suppliers");
}

export async function updateSupplierStatus(formData: FormData) {
  const id = readRequiredText(formData, "id");
  const status = readEnum<SupplierStatusValue>(formData, "status", supplierStatuses, "prospect");
  const db = getDb();
  const [previous] = await db.select({ id: suppliers.id, name: suppliers.name, status: suppliers.status }).from(suppliers).where(eq(suppliers.id, id)).limit(1);
  if (!previous) throw new Error("Fornecedor nao encontrado.");
  await db.update(suppliers).set({ status, updatedAt: new Date() }).where(eq(suppliers.id, id));
  await db.insert(eventLogs).values({
    eventType: "supplier.status_changed",
    entityType: "supplier",
    entityId: previous.id,
    payload: { name: previous.name, from: previous.status, to: status },
  });
  revalidatePath("/suppliers");
  revalidatePath("/events");
  redirect("/suppliers");
}

export async function createSupplierContract(formData: FormData) {
  const supplierId = readRequiredText(formData, "supplierId");
  const title = readRequiredText(formData, "title");
  const status = readEnum<ContractStatusValue>(formData, "status", contractStatuses, "draft");
  const value = readOptionalInteger(formData, "value");
  const db = getDb();
  const [contract] = await db.insert(supplierContracts).values({
    supplierId,
    title,
    status,
    contractNumber: readOptionalText(formData, "contractNumber"),
    startsAt: readOptionalDate(formData, "startsAt"),
    endsAt: readOptionalDate(formData, "endsAt"),
    valueCents: value ? value * 100 : undefined,
    scope: readOptionalText(formData, "scope"),
    ownerTeamId: readOptionalText(formData, "ownerTeamId"),
  }).returning({
    id: supplierContracts.id,
    supplierId: supplierContracts.supplierId,
    title: supplierContracts.title,
    status: supplierContracts.status,
  });

  await db.insert(eventLogs).values({
    eventType: "supplier_contract.created",
    entityType: "supplier_contract",
    entityId: contract.id,
    payload: contract,
  });

  revalidatePath("/");
  revalidatePath("/suppliers");
  revalidatePath("/events");
  redirect("/suppliers");
}
