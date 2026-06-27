import React from 'react';
import type { WorkforceMember } from './contracts/workforce.schema';
import Link from 'next/link';

export function TechniciansTable({ technicians }: { technicians: WorkforceMember[] }) {
  return (
    <div className="overflow-x-auto border border-[#d7dccf] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[#d7dccf]">
        <thead className="bg-[#fbfcf8]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#65705f] uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#65705f] uppercase tracking-wider">Nível</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#65705f] uppercase tracking-wider">Função</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#65705f] uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-[#65705f] uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#d7dccf]">
          {technicians.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#8a9684] italic">Nenhum técnico consolidado encontrado.</td>
            </tr>
          ) : (
            technicians.map((t) => (
              <tr key={t.id} className="hover:bg-[#fbfcf8] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111510]">{t.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4d5848]">{t.level}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4d5848]">{t.function || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    t.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/workforce/${t.id}`} className="text-[#31402d] hover:text-[#111510] underline">Ver Detalhes</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
