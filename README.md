# Prumo

> O sistema operacional de uma equipe remota orientada a resultado.
> Trabalho remoto visível **pelo processo** — não pela vigilância.

**No ar:** [prumo.cleberbatistapro.com.br](https://prumo.cleberbatistapro.com.br) · login demo, senha única `Prumo@123`

Prumo é formado por duas plataformas-irmãs de verdade — cada uma com banco e deploy
próprios, conversando só por contrato de API:

- **[Fluxo](fluxo/)** — o trabalho visível: linha de produção, gargalo, corrente da tarefa,
  Desempenho Individual, auditoria imutável, RBAC checado no servidor. `Prumo/fluxo/`
- **[Agenda](agenda/)** — a primeira ferramenta do Toolbox plugada de verdade, provando
  integração e isolamento de falhas ao mesmo tempo. `Prumo/agenda/`

Arquitetura completa, princípios e ordem de construção: **[mapa-mestre-prumo.md](mapa-mestre-prumo.md)**.

## Rodar localmente

```bash
cd fluxo  && npm install && npm run db:migrate:local && npm run db:seed:local && npm run dev   # :8788
cd agenda && npm install && npm run db:migrate:local && npm run db:seed:local && npm run dev   # :8790
```

Abra `http://localhost:8788` — cai na landing. Login de demonstração (3 cargos, senha única
`Prumo@123`): `ana@prumo.demo` (Assistente), `carla@prumo.demo` (Coordenador),
`gerente@prumo.demo` (Gerente).

## Status

**Fase Recrutador — 7/7 blocos fechados.** Autenticação real, RBAC no servidor, auditoria
imutável, Linha de Produção com dados reais, Desempenho Individual com a régua da própria
média, landing de 20 segundos, e a Agenda plugada como plataforma-irmã de verdade.

## Referência de design

`mockup-fluxo-tarefa-v2.html` e `mockup-desempenho-individual.html` — os mockups estáticos
que guiaram a construção. Ficam no repositório como registro da tela aprovada antes de cada
bloco ser implementado (seção 8 do mapa mestre: "arquitetura antes de estética").
