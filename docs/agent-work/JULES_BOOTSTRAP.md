# Jules Bootstrap

Para iniciar a execução de uma task, o Jules Dev deve rodar:

`JULES_WORKER_KEY=<worker-id> npm run agent-work -- bootstrap`

Isso fará:
1. Buscar o pacote disponível no db isolado.
2. Fazer o transacional claim (evitando colisões com outras IAs paralelas).
3. Gerar e imprimir o Task Kit em JSON.
4. O Jules Dev deve ler o `readFirst` e seguir o Kit antes de modificar qualquer código.
