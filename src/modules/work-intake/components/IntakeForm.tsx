import { captureIntakeAction } from "../actions";

export function IntakeForm() {
  return (
    <form action={captureIntakeAction} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova Entrada</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Capture uma nova solicitação ou observação para triagem.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Título</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="title"
            placeholder="Resumo da solicitação"
            required
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Categoria</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="category"
              placeholder="Ex: Infra, Software, Processo"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Prioridade</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue="medium"
              name="priority"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descrição</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="description"
            placeholder="Detalhes adicionais..."
          />
        </label>

        <div className="border-t border-[#f0f2ed] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#65705f]">
            Dados do Solicitante
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#273025]">Nome</span>
              <input
                className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
                name="requesterName"
                placeholder="Quem solicita?"
                required
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#273025]">Contato</span>
                <input
                  className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
                  name="requesterContact"
                  placeholder="Email ou telefone"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#273025]">Departamento</span>
                <input
                  className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
                  name="requesterDepartment"
                  placeholder="Setor"
                />
              </label>
            </div>
          </div>
        </div>

        <button
          className="mt-2 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Capturar Solicitação
        </button>
      </div>
    </form>
  );
}
