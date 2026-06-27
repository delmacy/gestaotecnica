import { getCaseById, getCaseHistory, getCaseComments, getUsers } from "@/modules/case-management/queries";
import { updateCaseAction, addCaseCommentAction } from "@/modules/case-management/actions";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCaseById(id);
  if (!c) notFound();

  const history = await getCaseHistory(id);
  const comments = await getCaseComments(id);
  const users = await getUsers();
  const responsible = users.find((u: { id: string, name: string }) => u.id === c.responsibleId);

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{c.title}</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {c.status}
            </span>
          </div>
          <p className="text-gray-600 mb-6">{c.description || "Sem descrição."}</p>

          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
            <div>
              <span className="text-gray-500 font-medium">Categoria:</span> {c.category}
            </div>
            <div>
              <span className="text-gray-500 font-medium">Prioridade:</span> {c.priority}
            </div>
            <div>
              <span className="text-gray-500 font-medium">Responsável:</span> {responsible?.name || "Não atribuído"}
            </div>
            <div>
              <span className="text-gray-500 font-medium">Criado em:</span> {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Comentários</h2>
          <form action={addCaseCommentAction} className="mb-6">
            <input type="hidden" name="id" value={c.id} />
            <textarea
              name="body"
              rows={3}
              className="w-full border rounded-md p-2 mb-2"
              placeholder="Adicionar um comentário..."
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Comentar
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b pb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">{comment.authorName || "Sistema"}</span>
                  <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700">{comment.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Gestão do Caso</h2>
          <form action={updateCaseAction} className="space-y-4">
            <input type="hidden" name="id" value={c.id} />
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" defaultValue={c.status} className="mt-1 block w-full border rounded-md p-2">
                <option value="open">Aberto</option>
                <option value="in_progress">Em Progresso</option>
                <option value="pending">Pendente</option>
                <option value="resolved">Resolvido</option>
                <option value="closed">Fechado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsável</label>
              <select name="responsibleId" defaultValue={c.responsibleId || ""} className="mt-1 block w-full border rounded-md p-2">
                <option value="">Não atribuído</option>
                {users.map((u: { id: string, name: string }) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridade</label>
              <select name="priority" defaultValue={c.priority} className="mt-1 block w-full border rounded-md p-2">
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Salvar Alterações
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Histórico</h2>
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="text-sm border-l-2 border-gray-200 pl-3">
                <div className="text-gray-500">{new Date(h.occurredAt).toLocaleString()}</div>
                <div>{h.eventType}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
