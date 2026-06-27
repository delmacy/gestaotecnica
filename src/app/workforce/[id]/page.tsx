import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTechnicianById,
  getUnavailabilities,
  getWorkforceHistory
} from "@/modules/workforce/queries";
import { TechnicianDetail } from "@/modules/workforce/components/TechnicianDetail";

export const dynamic = "force-dynamic";

export default async function TechnicianDetailPage({ params }: { params: { id: string } }) {
  const [member, unavailabilities, history] = await Promise.all([
    getTechnicianById(params.id),
    getUnavailabilities(params.id),
    getWorkforceHistory(params.id, "workforce_member")
  ]);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b] p-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#111510]">{member.name}</h1>
          <Link
            className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
            href="/workforce"
          >
            Voltar para Listagem
          </Link>
        </div>

        <TechnicianDetail
          member={member}
          unavailabilities={unavailabilities}
          history={history}
        />
      </div>
    </main>
  );
}
