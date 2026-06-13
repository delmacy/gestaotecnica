# Cross Module Change Policy

Qualquer alteração que necessite atravessar domínios exige dependência explícita.
Worker A não edita `src/modules/B/`. Worker A registra dependência "Need X from B". Worker B claima task "Export X", e só então A pode concluir sua feature.
