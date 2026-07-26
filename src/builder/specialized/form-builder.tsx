"use client";

import { FileText, Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";
import { useState } from "react";
import { executeKernelAction } from "@/platform/actions/remote-actions";

let formFieldId = 0;

function createFieldId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  formFieldId += 1;
  return `field-${formFieldId}`;
}

export function FormBuilder({
  activeItem,
  activeWorkspaceId,
}: {
  activeItem: any; // explicit-any-ok
  activeWorkspaceId: string | null;
}) {
  const [fields, setFields] = useState([
    { id: '1', label: 'Título', type: 'text', required: true },
    { id: '2', label: 'Descrição', type: 'textarea', required: false }
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { id: createFieldId(), label: 'Novo Campo', type: 'text', required: false }]);
  };

  const handleSave = async () => {
     const workspaceId = activeItem.metadata?.workspaceId || activeWorkspaceId;
     if (!workspaceId) {
       alert("Selecione um workspace antes de salvar o formulário.");
       return;
     }

     setIsSaving(true);
     try {
       const result = await executeKernelAction("views.save_definition", {
         workspaceId,
         key: `${activeItem.metadata?.key || activeItem.id}_form`,
         name: activeItem.label + " Form",
         config: { fields }
       });
       if (result.success) alert("Formulário salvo no Registry!");
     } catch {
       alert("Erro ao salvar formulário.");
     } finally {
       setIsSaving(false);
     }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-muted/5 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b pb-6">
          <div className="flex items-center gap-3">
             <div className="size-10 rounded bg-primary/10 text-primary flex items-center justify-center"><FileText /></div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight">{activeItem.label} Form</h1>
               <p className="text-xs text-muted-foreground">Definição de campos de entrada para o processo.</p>
             </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold uppercase shadow-sm flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
            Save Form
          </button>
        </div>

        <div className="space-y-3">
           {fields.map((field, i) => (
             <div key={field.id} className="bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm group">
                <GripVertical className="size-4 text-muted-foreground/30 cursor-grab" />
                <div className="flex-1 grid md:grid-cols-3 gap-4">
                   <div>
                     <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Label</label>
                     <input
                       className="w-full bg-transparent border-b outline-none text-sm focus:border-primary"
                       value={field.label}
                       onChange={e => {
                         const next = [...fields];
                         next[i].label = e.target.value;
                         setFields(next);
                       }}
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Type</label>
                     <select className="bg-transparent border-b w-full outline-none text-sm">
                        <option>Short Text</option>
                        <option>Long Text (Area)</option>
                        <option>Number</option>
                        <option>Date</option>
                        <option>User Select</option>
                     </select>
                   </div>
                   <div className="flex items-center gap-2 pt-4">
                      <input type="checkbox" checked={field.required} readOnly className="size-3" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Required</span>
                   </div>
                </div>
                <button
                  onClick={() => setFields(fields.filter(f => f.id !== field.id))}
                  className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
             </div>
           ))}

           <button
             onClick={addField}
             className="w-full border-2 border-dashed rounded-xl py-4 text-xs font-bold uppercase text-muted-foreground hover:bg-white hover:text-primary transition-all flex items-center justify-center gap-2"
           >
             <Plus className="size-4" /> Add Input Field
           </button>
        </div>
      </div>
    </div>
  );
}
