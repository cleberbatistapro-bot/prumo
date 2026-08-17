# Prumo — Fluxo

**No ar:** [prumo.cleberbatistapro.com.br](https://prumo.cleberbatistapro.com.br)

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

## Testes

```bash
npm test
```

Cobre a lógica pura mais importante: hash/verificação de senha, o cálculo de status/prazo/estado
da corrente de cada tarefa, e a régua de desempenho (baseline = média dos 5 meses anteriores,
nunca comparação entre pessoas). Não sobe servidor nem toca no banco — são funções puras.

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
- "Adicionar tarefa" monta a corrente inteira na criação (vários responsáveis em sequência,
  cada um com seu prazo e ferramenta sugerida) e grava direto no D1. Só Coordenador e Gerente
  criam, editam ou excluem tarefas — Assistente executa dentro do que foi definido. Editar e
  excluir sempre passam por uma confirmação explícita antes de efetivar.
- Assistente só vê as tarefas em que é o responsável atual da corrente — filtro aplicado no
  servidor (`/api/tasks`), não escondido na tela.
- Chips de status (atrasadas/na média/adiantadas) são clicáveis: destacam as tarefas
  correspondentes no quadro e esmaecem o resto.
- Desempenho Individual com dados reais: `performance_monthly` + `attendance_days` no D1.
  A "média dela" (baseline) é calculada no servidor como a média dos 5 meses anteriores ao
  atual — nunca comparação entre colegas. Só Gerente acessa (`/api/performance`), com
  tentativa negada gravada na auditoria como qualquer outra.

## Deploy

Já em produção em `prumo-fluxo` (Cloudflare Pages) + `prumo-fluxo-db` (D1), domínio custom
`prumo.cleberbatistapro.com.br` apontado por CNAME. Pra atualizar depois de mudar código:

```bash
npx wrangler pages deploy public --project-name=prumo-fluxo --branch=master
```

Pra mudanças de schema: rodar a migração nova com `--remote` antes do deploy. O secret
`AGENDA_SHARED_KEY` já está configurado (`wrangler pages secret put`) — nunca em `[vars]`,
senão um deploy comum reescreve por cima dele.

## Segurança do login

5 tentativas de senha errada seguidas travam a conta por 15 minutos — mesmo que a próxima
tentativa use a senha certa, o login é recusado até o bloqueio acabar. Cada tentativa durante
o bloqueio, e o próprio bloqueio, viram linha na auditoria.

## Toolbox — Agenda plugada

O Toolbox chama a plataforma-irmã [Agenda](../agenda/README.md) a partir de
`functions/api/agenda.ts` (server-side, a chave de contrato nunca chega ao navegador). Se a
Agenda cair, a tela mostra "indisponível" — testado de verdade derrubando o servidor da
Agenda com o Fluxo no ar.

## Fase Recrutador — fechada

Os 7 blocos da seção 5 do [mapa mestre](../mapa-mestre-prumo.md) estão todos entregues:
Espinha, Fluxo núcleo, corrente da tarefa, Desempenho Individual, Landing, Agenda plugada e,
por último, dados demo + acabamento visual (bloco 7) — sistema de design próprio (paleta cyan,
glassmorphism, tipografia Plus Jakarta Sans/Geist, gradientes e linhas de grade sutis),
aplicado de ponta a ponta na landing, no app, nos mockups e na Agenda.

Próximo passo é fora do código: inserir o case no portfólio pessoal e usar na candidatura. Os
itens da Fase Produto (Toolbox completo, aprovações em níveis, Pulso da operação etc.) ficam
para quando o objetivo virar "produto vendável", não antes.
