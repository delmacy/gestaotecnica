import React from 'react';
import type { EmployeeProfile, EmployeeHistoryEvent } from '../contracts/hr.schema';

interface EmployeeDetailProps {
  employee: EmployeeProfile;
  history?: EmployeeHistoryEvent[];
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, history }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Perfil do Colaborador</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Detalhes profissionais e funcionais.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Nome Completo</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.name}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Matrícula</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.registrationCode}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Cargo</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.position}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Departamento</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.department}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Data de Admissão</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.admissionDate}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Gestor</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.managerName || 'Não informado'}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Situação</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.status}</dd>
          </div>
          {employee.observations && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Observações</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{employee.observations}</dd>
            </div>
          )}
        </dl>
      </div>

      {history && history.length > 0 && (
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900">Histórico de Alterações</h4>
          <ul className="mt-2 divide-y divide-gray-200">
            {history.map((event) => (
              <li key={event.id} className="py-2 text-sm text-gray-600">
                <span className="font-semibold">{new Date(event.occurredAt).toLocaleString()}:</span> {event.eventType}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
