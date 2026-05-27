import {
  createEntityAttachment,
  createEntityComment,
} from "./actions";

type EntityComment = {
  id: string;
  body: string;
  createdAt: Date;
  authorName: string | null;
};

type EntityAttachment = {
  id: string;
  title: string;
  fileUrl: string;
  mimeType: string | null;
  createdAt: Date;
  authorName: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function EntityCollaboration({
  attachments,
  comments,
  entityId,
  entityType,
  returnTo,
}: {
  attachments: EntityAttachment[];
  comments: EntityComment[];
  entityId: string;
  entityType: string;
  returnTo: string;
}) {
  return (
    <section className="space-y-6">
      <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Comentarios</h2>
        <form action={createEntityComment} className="mt-4 space-y-3">
          <input name="entityType" type="hidden" value={entityType} />
          <input name="entityId" type="hidden" value={entityId} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <textarea
            className="min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="body"
            placeholder="Adicione contexto, decisao ou orientacao para continuidade."
            required
          />
          <button
            className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
            type="submit"
          >
            Adicionar comentario
          </button>
        </form>
        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Nenhum comentario registrado.</p>
          ) : (
            comments.map((comment) => (
              <div className="border border-[#e0e5d9] p-3" key={comment.id}>
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#273025]">
                  {comment.body}
                </p>
                <p className="mt-2 font-mono text-xs text-[#7a8474]">
                  {comment.authorName ?? "Sistema"} - {formatDate(comment.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </article>

      <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Anexos</h2>
        <form action={createEntityAttachment} className="mt-4 space-y-3">
          <input name="entityType" type="hidden" value={entityType} />
          <input name="entityId" type="hidden" value={entityId} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <input
            className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="title"
            placeholder="Titulo do anexo"
            required
          />
          <input
            className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="fileUrl"
            placeholder="https://..."
            required
            type="url"
          />
          <input
            className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="mimeType"
            placeholder="image/jpeg, application/pdf"
          />
          <button
            className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
            type="submit"
          >
            Adicionar anexo
          </button>
        </form>
        <div className="mt-5 space-y-3">
          {attachments.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Nenhum anexo registrado.</p>
          ) : (
            attachments.map((attachment) => (
              <a
                className="block border border-[#e0e5d9] p-3 transition hover:bg-[#f6f7f4]"
                href={attachment.fileUrl}
                key={attachment.id}
                rel="noreferrer"
                target="_blank"
              >
                <p className="font-semibold text-[#182017]">{attachment.title}</p>
                <p className="mt-1 text-sm text-[#5b6655]">{attachment.fileUrl}</p>
                <p className="mt-2 font-mono text-xs text-[#7a8474]">
                  {attachment.mimeType ?? "tipo nao informado"} -{" "}
                  {formatDate(attachment.createdAt)}
                </p>
              </a>
            ))
          )}
        </div>
      </article>
    </section>
  );
}
