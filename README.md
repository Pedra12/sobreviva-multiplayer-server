# Sobreviva às Suas Ideias 3D — servidor multiplayer

Servidor Colyseus separado do jogo HTML. A primeira fase oferece salas privadas para até 8 jogadores e sincroniza presença, apelido, personagem, posição, direção e movimento.

## Publicar no Render

1. Abra o painel do Render e entre na sua conta.
2. Escolha **New + → Blueprint**.
3. Conecte este repositório: `Pedra12/sobreviva-multiplayer-server`.
4. O Render detectará o arquivo `render.yaml`. Confirme a criação do serviço.
5. Aguarde o deploy terminar e copie a URL HTTPS gerada, por exemplo `https://sobreviva-multiplayer.onrender.com`.
6. Abra o jogo v47, toque em **MULTIPLAYER** e cole essa URL no campo de endereço do servidor.

## Verificar o servidor

Abra a URL do serviço no navegador. A rota raiz deve retornar um JSON com `"status":"online"`; `/health` deve responder `ok`.

## Limites desta primeira fase

Os jogadores podem entrar na mesma sala e sincronizar seus avatares e movimentos. Vida, dano, eliminações, vitória e catástrofes ainda não são sincronizados. O modo solo continua independente do servidor.

O plano gratuito pode suspender o serviço após inatividade; a primeira conexão seguinte pode demorar para acordar.
