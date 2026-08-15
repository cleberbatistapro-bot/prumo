# Prumo — Agenda

Plataforma-irmã de verdade: banco (`prumo-agenda-db`) e deploy (`prumo-agenda`) próprios,
separados do Fluxo. Conversa com as outras irmãs só por contrato de API — nenhuma conhece
as tripas da outra (seção 3 do [mapa mestre](../mapa-mestre-prumo.md)).

## O contrato

`GET /api/events?person=<email>` retorna os próximos eventos de uma pessoa, exigindo o
header `X-Prumo-Key` com a chave compartilhada (`AGENDA_SHARED_KEY`, hoje um valor de
demo — em produção viraria um secret real por plataforma). Sem a chave certa: `401`.

O Fluxo nunca lê o banco da Agenda diretamente — ele chama esse endpoint a partir da sua
própria Function (`fluxo/functions/api/agenda.ts`), que segura a chave no servidor. Se a
Agenda cair, o Fluxo captura o erro e mostra "indisponível" — prova o isolamento de falhas
na prática, não só na documentação.

## Rodar localmente

```bash
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Sobe em `http://localhost:8790`. A UI própria (`public/index.html`) lista os eventos dos 3
e-mails de demonstração direto, sem autenticação própria ainda — a Agenda de verdade um dia
compartilha a mesma identidade/login do Fluxo (ver seção 3 do mapa mestre); por ora, fora do
escopo da Fase Recrutador.

## Antes do deploy real

```bash
npx wrangler d1 create prumo-agenda-db
npx wrangler pages secret put AGENDA_SHARED_KEY --project-name=prumo-agenda
```

Substituir `database_id` em `wrangler.toml`, trocar o `AGENDA_SHARED_KEY` de `[vars]` por um
valor real via secret, e repetir a mesma chave do lado do Fluxo.
