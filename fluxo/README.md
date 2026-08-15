# Prumo — Fluxo

Plataforma-irmã "o trabalho visível". Este pacote é a **Fase 0 — Espinha**: autenticação real,
RBAC verificado no servidor e auditoria imutável — a fundação sobre a qual a Linha de Produção
(já validada em `../mockup-fluxo-tarefa-v2.html`) será construída no próximo bloco.

Stack: Cloudflare Pages + Pages Functions + D1 (SQLite), conforme a seção 6 do
[mapa mestre](../mapa-mestre-prumo.md).

## Rodar localmente

```bash
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Abre em `http://localhost:8788`. Login de demonstração (senha única): `Prumo@123`
- `ana@prumo.demo` — Assistente
- `carla@prumo.demo` — Coordenador
- `gerente@prumo.demo` — Gerente

## O que já é real (não mock)

- Senha com PBKDF2-SHA256 (Web Crypto, nativo do runtime de Workers) — nunca texto plano.
- Sessão por cookie `HttpOnly` + hash do token no banco (o token puro nunca é persistido).
- RBAC checado em cada endpoint (`/api/audit`, `/api/users`) — não só escondido na tela.
- Toda tentativa de acesso, permitida ou negada, grava uma linha em `audit_log` (só `INSERT`,
  nunca `UPDATE`/`DELETE` pela aplicação).

## Antes do primeiro deploy real

```bash
npx wrangler d1 create prumo-fluxo-db
```

Substituir `database_id` em `wrangler.toml` pelo id retornado, rodar as migrações com
`--remote` e então `npm run deploy`.

## Próximo bloco

Linha de Produção (etapas, contador, semáforo, gargalo, corrente da tarefa) — usar
`../mockup-fluxo-tarefa-v2.html` como referência aprovada, agora ligado a tarefas reais no D1.
