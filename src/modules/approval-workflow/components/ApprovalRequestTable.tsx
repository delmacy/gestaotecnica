import React from "react";
import { type ApprovalRequest } from "../contracts";
import Link from "next/link";

export function ApprovalRequestTable({ requests }: { requests: ApprovalRequest[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.subjectType} ({request.subjectId})</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${request.status === "completed" ? "bg-green-100 text-green-800" :
                    request.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {request.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.createdAt.toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/approvals/${request.id}`} className="text-indigo-600 hover:text-indigo-900">Ver detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
