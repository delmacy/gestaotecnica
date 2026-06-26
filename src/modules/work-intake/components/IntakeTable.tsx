import Link from "next/link";
import type { IntakeRequest } from "../contracts/intake.schema";

export function IntakeTable({ requests }: { requests: IntakeRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center border border-dashed border-[#c8d0bf] bg-white p-8 text-center">
        <div>
          <p className="text-sm text-[#5b6655]">Nenhuma solicitação encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-[#d7dccf] bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#d7dccf] bg-[#fbfcf8] text-[#6e7a66]">
          <tr>
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Prioridade</th>
            <th className="px-4 py-3 font-medium">Solicitante</th>
            <th className="px-4 py-3 font-medium">Data</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f2ed]">
          {requests.map((req) => (
            <tr className="hover:bg-[#fbfcf8]" key={req.id}>
              <td className="px-4 py-3">
                <p className="font-semibold text-[#111510]">{req.title}</p>
                <p className="text-xs text-[#6e7a66] line-clamp-1">{req.description}</p>
              </td>
              <td className="px-4 py-3 text-[#273025]">{req.category}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-[#eef2eb] px-2 py-0.5 text-xs font-medium text-[#3a4736]">
                  {req.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-semibold uppercase ${
                  req.priority === 'critical' ? 'text-red-600' :
                  req.priority === 'high' ? 'text-orange-600' :
                  'text-[#6e7a66]'
                }`}>
                  {req.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <p className="text-[#273025]">{req.requester.name}</p>
                <p className="text-xs text-[#6e7a66]">{req.requester.department}</p>
              </td>
              <td className="px-4 py-3 text-[#6e7a66]">
                {req.createdAt ? new Date(req.createdAt).toLocaleDateString('pt-BR') : '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  className="text-xs font-bold uppercase tracking-wider text-[#31402d] hover:underline"
                  href={`/work-intake/${req.id}`}
                >
                  Detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
