# Prumo — Fluxo

Plataforma-irmã "o trabalho visível". Autenticação real, RBAC verificado no servidor, auditoria
imutável (Fase 0 — Espinha) **e** a Linha de Produção com tarefas reais no D1 (blocos 2 e 3:
núcleo do fluxo + corrente da tarefa) — não é mais mockup estático, é o sistema rodando de
verdade contra um banco.

Stack: Cloudflare Pages + Pages Functions + D1 (SQLite), conforme a seção 6 do
[mapa mestre](../mapa-mestre-prumo.md).

## Rodar localmente

```bash
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Abre em `http://localhost:8788` — cai na **landing** (`public/index.html`). O app (login +
telas) fica em `public/app.html`. Login de demonstração (senha única): `Prumo@123`
- `ana@prumo.demo` — Assistente
- `carla@prumo.demo` — Coordenador
- `gerente@prumo.demo` — Gerente

## O que já é real (não mock)

- Senha com PBKDF2-SHA256 (Web Crypto, nativo do runtime de Workers) — nunca texto plano.
- Sessão por cookie `HttpOnly` + hash do token no banco (o token puro nunca é persistido).
- RBAC checado em cada endpoint (`/api/audit`, `/api/users`) — não só escondido na tela.
- Toda tentativa de acesso, permitida ou negada, grava uma linha em `audit_log` (só `INSERT`,
  nunca `UPDATE`/`DELETE` pela aplicação).
- Linha de Produção com dados reais: `tasks` + `task_chain` no D1. Gargalo, contador, semáforo
  e corrente da tarefa são todos calculados no servidor a partir do banco.
- "Adicionar tarefa" grava direto no D1 e aparece na linha de todo mundo na hora.
- Assistente só vê as tarefas em que é o responsável atual da corrente — filtro aplicado no
  servidor (`/api/tasks`), não escondido na tela.
- Desempenho Individual com dados reais: `performance_monthly` + `attendance_days` no D1.
  A "média dela" (baseline) é calculada no servidor como a média dos 5 meses anteriores ao
  atual — nunca comparação entre colegas. Só Gerente acessa (`/api/performance`), com
  tentativa negada gravada na auditoria como qualquer outra.

## Antes do primeiro deploy real

```bash
npx wrangler d1 create prumo-fluxo-db
```

Substituir `database_id` em `wrangler.toml` pelo id retornado, rodar as migrações com
`--remote` e então `npm run deploy`.

## Próximo bloco

Ligar a Agenda como primeira plataforma-irmã de verdade via API (bloco 6) — ver seção 5 do
[mapa mestre](../mapa-mestre-prumo.md). Blocos 1–5 (Espinha, Fluxo núcleo, corrente da
tarefa, Desempenho Individual, Landing) já estão fechados.
