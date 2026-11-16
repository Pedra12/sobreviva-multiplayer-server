# Sobreviva às Suas Ideias 3D — servidor multiplayer

Servidor Colyseus separado do jogo HTML. Suporta salas privadas para até 8 jogadores.

## Cliente compatível

Use o HTML **v49 ou posterior** com este servidor. A v48 adiciona:
- criação de ideias/eventos transmitida para todos os jogadores da sala;
- semente aleatória e posição de origem compartilhadas para a criação correspondente;
- host da sala publica snapshots de posição/rotação/estado básico das entidades;
- avatares e movimentos dos jogadores continuam sincronizados;
- modo solo continua funcionando sem conexão.

## Publicar no Render

1. Abra o painel do Render e entre na sua conta.
2. Escolha **New + → Blueprint**.
3. Conecte este repositório: `Pedra12/sobreviva-multiplayer-server`.
4. O Render detectará o arquivo `render.yaml`. Confirme a criação do serviço.
5. Aguarde o deploy terminar e copie a URL HTTPS gerada, por exemplo `https://sobreviva-multiplayer.onrender.com`.
6. No jogo v48, toque em **MULTIPLAYER** e cole essa URL no campo de endereço do servidor.

## Verificar o servidor

Abra a URL do serviço no navegador. A rota raiz deve retornar um JSON com `"status":"online"`; `/health` deve responder `ok`.

## O que ainda não está totalmente sincronizado

A v48 compartilha os comandos que criam ideias/eventos e replica o estado espacial básico das entidades a partir do host. Ainda faltam validação completa em dois celulares e sincronização autoritativa de vida/dano dos jogadores, projéteis individuais da chuva, destruição de construções, eliminações e condição de vitória. Portanto, esta é uma etapa de implementação, não uma declaração de multiplayer finalizado.

O plano gratuito pode suspender o serviço após inatividade; a primeira conexão seguinte pode demorar para acordar.
