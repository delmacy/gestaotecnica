export default function ReportsLoading() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="h-3 w-24 animate-pulse bg-[#e0e5d9]" />
              <div className="h-10 w-48 animate-pulse bg-[#e0e5d9]" />
              <div className="h-4 w-96 animate-pulse bg-[#e0e5d9]" />
            </div>
            <div className="h-10 w-32 animate-pulse bg-[#e0e5d9]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                className="h-24 border border-[#d7dccf] bg-white p-4 shadow-sm animate-pulse"
                key={i}
              >
                <div className="h-3 w-16 bg-[#f1f3ed]" />
                <div className="mt-3 h-8 w-12 bg-[#f1f3ed]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-8">
          <div className="h-64 border border-[#d7dccf] bg-white animate-pulse" />
          <div className="h-96 border border-[#d7dccf] bg-white animate-pulse" />
        </div>
        <aside className="space-y-6">
          <div className="h-80 border border-[#d7dccf] bg-white animate-pulse" />
          <div className="h-64 border border-[#d7dccf] bg-white animate-pulse" />
        </aside>
      </section>
    </main>
  );
}
