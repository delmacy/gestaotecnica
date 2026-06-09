# Modulo: Auth

## Configuracao

Use `/auth/setup` para criar o primeiro administrador e `/auth/login` para entrar. A sessao usa cookie HTTP-only e protege `/admin` e `/workspace-config`.

## Adaptacao por cliente

Defina politicas de senha, rotas protegidas e modelo futuro de provedor externo conforme o cliente. Usuarios operacionais ficam em `users`; credenciais locais ficam em `auth_accounts`.
