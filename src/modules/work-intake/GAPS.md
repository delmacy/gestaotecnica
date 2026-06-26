# Gaps and Dependencies: Work Intake Module

## Dependências de Registro (Registro Manual Necessário)
O módulo `work-intake` foi desenvolvido seguindo o isolamento de agentes, o que proíbe Jules de alterar o `src/platform/kernel.ts`. Para que o módulo seja operável no sistema, um humano ou um agente Core deve realizar as seguintes alterações:

### No arquivo `src/platform/kernel.ts`:

1.  **Importar o manifesto e as kernel actions:**
    ```typescript
    import { workIntakeManifest } from "@/modules/work-intake/manifest";
    import {
      captureIntakeKernelAction,
      transitionIntakeKernelAction,
    } from "@/modules/work-intake/kernel-actions";
    ```

2.  **Registrar o módulo na função `initializePlatformKernel`:**
    ```typescript
    registerModule(workIntakeManifest);
    ```

3.  **Registrar as ações na função `initializePlatformKernel`:**
    ```typescript
    registerAction(captureIntakeKernelAction);
    registerAction(transitionIntakeKernelAction);
    ```

## Gaps de Funcionalidade
- **Conversão Automática:** A conversão de uma solicitação `converted` em uma `Service Order` ou `Process Instance` real deve ser implementada por um flow de automação ou pelo módulo correspondente consumindo o evento `work_intake.transitioned`.
- **Anexos:** Suporte para evidências e anexos durante o intake ainda não foi implementado (depende de integração com o módulo `evidences`).
- **Filtros Avançados:** A UI atual suporta listagem básica; filtros avançados por data, solicitante ou metadados são gaps para versões futuras.
