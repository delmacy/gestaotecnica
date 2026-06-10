import { ACTIVE_MODULES, FUTURE_MODULES } from "@/components/builder/shell/shell-data";
import Link from "next/link";

export default function Page() {
  // We remove the old BuilderPage load, and replace it with the new Dashboard.

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-2">System Builder</h1>
        <p className="text-muted-foreground text-lg mb-6">
          Markdown primeiro. Contrato depois. Código por último.
        </p>

        <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-md p-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-sm">Synthetic/Demo Mode Ativo</p>
              <p className="text-sm mt-1">
                Gestão Técnica e fontes reais permanecem em fase futura. Operações de banco de dados e autenticação real estão simuladas ou desabilitadas nesta visualização.
              </p>
            </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Módulos Ativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTIVE_MODULES.filter(m => m.href !== "/builder").map((module) => {
             const Icon = module.icon;
             return (
               <Link
                 href={module.href}
                 key={module.label}
                 className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 hover:shadow-sm transition-all"
               >
                 <div className="p-3 bg-primary/10 rounded-md text-primary">
                   <Icon className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-medium">{module.label}</h3>
                   <p className="text-xs text-muted-foreground mt-1">Acesso Mockado</p>
                 </div>
               </Link>
             )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Módulos Futuros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FUTURE_MODULES.map((module) => {
             const Icon = module.icon;
             return (
               <div
                 key={module.label}
                 className="flex items-center gap-4 p-4 border border-dashed rounded-lg bg-muted/20 opacity-60 grayscale cursor-not-allowed"
               >
                 <div className="p-3 bg-muted rounded-md text-muted-foreground">
                   <Icon className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-medium text-muted-foreground">{module.label}</h3>
                   <p className="text-[10px] uppercase font-semibold mt-1 tracking-wider">
                     {module.status === 'blocked' ? 'Blocked' : 'Coming Soon'}
                   </p>
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}
