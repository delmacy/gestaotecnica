import { count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { supplierContracts, suppliers, teams } from "@/db/schema";

export type SupplierOptions = {
  suppliers: Array<{ id: string; name: string }>;
  teams: Array<{ id: string; name: string }>;
};

export async function getSuppliers() {
  const db = getDb();
  return db.select({
    id: suppliers.id,
    name: suppliers.name,
    documentNumber: suppliers.documentNumber,
    contactName: suppliers.contactName,
    contactEmail: suppliers.contactEmail,
    contactPhone: suppliers.contactPhone,
    status: suppliers.status,
    category: suppliers.category,
    notes: suppliers.notes,
  }).from(suppliers)
    .orderBy(desc(suppliers.createdAt))
    .limit(80);
}

export async function getSupplierContracts() {
  const db = getDb();
  return db.select({
    id: supplierContracts.id,
    title: supplierContracts.title,
    status: supplierContracts.status,
    contractNumber: supplierContracts.contractNumber,
    startsAt: supplierContracts.startsAt,
    endsAt: supplierContracts.endsAt,
    valueCents: supplierContracts.valueCents,
    scope: supplierContracts.scope,
    supplierName: suppliers.name,
    teamName: teams.name,
  }).from(supplierContracts)
    .innerJoin(suppliers, eq(supplierContracts.supplierId, suppliers.id))
    .leftJoin(teams, eq(supplierContracts.ownerTeamId, teams.id))
    .orderBy(desc(supplierContracts.createdAt))
    .limit(80);
}

export async function getSupplierSummary() {
  const db = getDb();
  const [active] = await db.select({ value: count() }).from(suppliers).where(eq(suppliers.status, "active"));
  const [review] = await db.select({ value: count() }).from(suppliers).where(eq(suppliers.status, "under_review"));
  const [contracts] = await db.select({ value: count() }).from(supplierContracts).where(eq(supplierContracts.status, "active"));
  return [
    { label: "Fornecedores ativos", value: active.value },
    { label: "Em revisao", value: review.value },
    { label: "Contratos ativos", value: contracts.value },
  ];
}

export async function getSupplierOptions(): Promise<SupplierOptions> {
  const db = getDb();
  const [supplierRows, teamRows] = await Promise.all([
    db.select({ id: suppliers.id, name: suppliers.name }).from(suppliers).orderBy(desc(suppliers.createdAt)).limit(80),
    db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(desc(teams.createdAt)).limit(50),
  ]);
  return { suppliers: supplierRows, teams: teamRows };
}
