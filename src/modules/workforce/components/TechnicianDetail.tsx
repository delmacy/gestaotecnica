import React from 'react';
import type { WorkforceMember, WorkforceUnavailability } from '../contracts/workforce.schema';
import { WorkforceHistory } from './WorkforceHistory';

export function TechnicianDetail({
  member,
  unavailabilities,
  history
}: {
  member: WorkforceMember,
  unavailabilities: WorkforceUnavailability[],
  history: any[]
}) {
  return (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Detalhe do Membro</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Informações consolidadas de força de trabalho.</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{member.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nível</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{member.level}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Função</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{member.function || '-'}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Competências</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.competencies.join(', ') || 'Nenhuma'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Situação</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{member.status}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Indisponibilidades</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Ausências e afastamentos registrados.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {unavailabilities.length === 0 ? (
              <li className="px-4 py-4 text-sm text-gray-500 italic">Nenhuma indisponibilidade registrada.</li>
            ) : (
              unavailabilities.map(u => (
                <li key={u.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{u.reason}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {u.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex text-sm text-gray-500">
                      <p>Início: {u.startsAt.toLocaleDateString()}</p>
                      <p className="mt-2 sm:mt-0 sm:ml-6">Fim: {u.endsAt?.toLocaleDateString() || '-'}</p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Histórico de Auditoria</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <WorkforceHistory events={history} />
        </div>
      </div>
    </div>
  );
}
