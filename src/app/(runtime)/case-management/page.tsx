import { getCases } from "@/modules/case-management/queries";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CaseListPage() {
  const cases = await getCases();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Casos</h1>
        <Link
          href="/case-management/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Novo Caso
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/case-management/${c.id}`} className="text-blue-600 hover:underline">
                    {c.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${c.status === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.priority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
