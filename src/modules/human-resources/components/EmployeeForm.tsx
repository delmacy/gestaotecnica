import React from 'react';
import type { CreateEmployeeInput, UpdateEmployeeInput, EmployeeProfile } from '../contracts/hr.schema';

interface EmployeeFormProps {
  initialData?: Partial<EmployeeProfile>;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    registrationCode: initialData?.registrationCode || '',
    position: initialData?.position || '',
    department: initialData?.department || '',
    admissionDate: initialData?.admissionDate || '',
    status: initialData?.status || 'active',
    observations: initialData?.observations || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="registrationCode" className="block text-sm font-medium text-gray-700">Matrícula</label>
          <input
            type="text"
            name="registrationCode"
            id="registrationCode"
            value={formData.registrationCode}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            name="position"
            id="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
          <input
            type="text"
            name="department"
            id="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">Data de Admissão</label>
          <input
            type="date"
            name="admissionDate"
            id="admissionDate"
            value={formData.admissionDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Situação</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
            <option value="suspended">Suspenso</option>
            <option value="on_boarding">Onboarding</option>
            <option value="off_boarding">Offboarding</option>
          </select>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="observations" className="block text-sm font-medium text-gray-700">Observações</label>
          <textarea
            id="observations"
            name="observations"
            rows={3}
            value={formData.observations}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData?.id ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
