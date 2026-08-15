# Mapa Mestre — Prumo
### O sistema operacional de uma equipe remota orientada a resultado

> **Prumo** é o nome público do produto (peça de portfólio). Ele é formado por duas plataformas-irmãs: o **Fluxo** (o trabalho visível) e o **Toolbox** (as ferramentas).
> Documento único de arquitetura. Serve como planta de tudo daqui pra frente.
> Regra de ouro: **nada é construído fora deste mapa; nada pronto é remexido.**

---

## 1. Estrela-guia

Tornar o trabalho remoto **visível pelo processo — não pela vigilância**, e transformar todo gargalo em **assistência**, não em punição.

Enquanto a concorrência (Monday, Asana, ClickUp) vende ferramenta genérica que a empresa adapta, o Fluxo tem uma tese com opinião. É isso que recruta gente que pensa — e é isso que, depois, vira produto vendável.

**Pitch de uma linha:** *"Eu não construí mais um app de vigilância. Construí uma forma de tornar o trabalho remoto visível pelo processo — a mesma rastreabilidade que eu usava no controle de qualidade, agora na rotina da equipe."*

---

## 2. Os quatro princípios que regem tudo

Toda decisão de tela, código ou escopo passa por estes quatro filtros:

1. **Controle pelo processo, não pela pessoa.** Controle total sobre os trilhos (fluxo, prazo, visibilidade). Liberdade total dentro dos trilhos (como, quando e de onde a pessoa entrega). O teste de cada recurso: *"isso controla o processo ou está espionando a pessoa?"*
2. **A régua da assistência.** Toda métrica — inclusive individual — aponta *onde ajudar*, nunca *quem culpar*. Comparação sempre contra o histórico da própria pessoa, jamais ranking entre colegas.
3. **Menos é mais.** Coerência vence quantidade. Cada nova ideia é candidata a ser cortada. O canivete suíço é o inimigo; a linha de produção afiada é o objetivo.
4. **Isolamento de falhas.** Peças separadas de verdade: problema numa não derruba nem contamina a outra. Estações independentes na mesma fábrica.

---

## 3. Arquitetura: irmãs, mas separadas

O sistema não é um app monolítico. São **plataformas-irmãs** que compartilham identidade, mas vivem separadas — cada uma com seu banco, seu deploy e sua própria "porta" de comunicação.

```
        IDENTIDADE COMPARTILHADA
   (login · cargo/RBAC · marca · auditoria)
                    |
    ----------------------------------
    |                                |
  FLUXO                          TOOLBOX
  (o trabalho visível)          (as ferramentas)
    |                                |
  banco próprio                  cada ferramenta:
  deploy próprio                 banco próprio + deploy próprio
    |                                |
    ---------- API / contrato --------
         (conversa pela "portinha";
          nenhuma conhece as tripas da outra)
```

**O que "separado de verdade" garante:**

- **Bancos separados** — se a base de uma ferramenta corromper, o Fluxo nem fica sabendo.
- **Deploys separados** — atualiza o Proc Fácil sem tocar no Fluxo; sobe correção na agenda sem risco de derrubar a linha.
- **Conversa por contrato** — o Fluxo pede "me dá a agenda dessa pessoa"; se a ferramenta cair, mostra "indisponível" e segue a vida.

**Custo honesto:** montar separado dá mais trabalho no começo (casas diferentes com uma porta entre elas). Paga-se isso com folga depois, em manutenção e em noite de sono — e um recrutador técnico lê isso como "esse cara entende arquitetura".

---

## 4. Inventário das peças (o sistema inteiro, já desenhado e aprovado)

### Fundação compartilhada
- **Autenticação** — login/senha, hash forte (bcrypt/argon2).
- **RBAC** — cargos: Assistente, Coordenador(a), Gerente + Admin de sistema (invisível ao negócio). Autorização verificada **no servidor**, sempre.
- **Auditoria** — log imutável de quem acessou o quê e quando.
- **Segurança/LGPD** — menor privilégio, minimização de dados, queries parametrizadas, HTTPS, segredos em variáveis de ambiente.

### Fluxo (o coração)
- **Linha de produção horizontal** — etapas início → fim, tarefas fluindo da esquerda pra direita.
- **Detecção de gargalo** — a etapa que empilha fica destacada; o aviso nomeia com quem está o atraso.
- **Contador regressivo + semáforo** — prazo por tarefa, dias contando pra trás; vermelho (atrasada), âmbar (na média), verde (adiantada). É o controle de prioridade visual.
- **Corrente da tarefa** — clicar no cartão abre a cadeia de pessoas; verde = entregou, âmbar = está com ela agora, vermelho = gargalo. Botão "Falar com [pessoa]" no tom de apoio.
- **Sugestão de ferramenta por tarefa** — a estação certa do Toolbox para cada tipo de trabalho.

### Desempenho Individual (o diferencial que ninguém tem)
- Dashboard **padronizado**, um por pessoa.
- Cada indicador comparado com **a média da própria pessoa** — nunca com colegas.
- **Sinal de desvio** nos dois sentidos: pra baixo → apoio/treinamento; pra cima → reconhecimento/promoção.
- Métricas: pontualidade (ponto + tendência), entregas e entregas no prazo, tempo médio de execução, e a linha de base individual com destaque para o desvio.
- Guarda-corpo visível na tela: *"comparação só com o histórico da própria pessoa; este painel não rankeia."*

### Toolbox (as estações)
- Ferramentas como irmãs separadas: **Agenda** (já usada no dia a dia), **Proc Fácil**, **Organizador de Arquivos**, **Renomeador**, **Dash Top**.

---

## 5. O mapa em fases

A meta manda a ordem: **primeiro te contratar (home office), depois transformá-lo em produto para vender.** O emprego é o laboratório pago que valida a solução em campo.

### Fase 0 — Espinha (fundação)
Fundação compartilhada por todas as irmãs.
- Autenticação + RBAC + Auditoria
- Shell/layout base com a identidade da marca
- Segurança base (authz no servidor, HTTPS, LGPD-aware)

### Fase Recrutador — o alvo de agora (enxuto pra contratar)
Tudo aqui existe para a **leitura de 90 segundos**. Nada que não sirva a isso entra.
- **Fluxo completo** — linha, gargalo, contador, semáforo, corrente da tarefa.
- **Desempenho Individual** — a peça mais diferenciadora; entra como herói.
- **Uma ferramenta plugada de verdade** — a Agenda, como irmã separada via API. Prova a integração *e* o isolamento de falhas de uma vez só.
- **Landing de 20 segundos** — página de abertura que explica a tese antes do login. É ela que faz o recrutador entender a *ideia* antes de clicar em nada.
- **Dados de demonstração** — usuários dos três cargos, pro recrutador logar e ver o RBAC funcionando na hora.

*Candidato opcional (só se não inchar):* uma faixa enxuta de "Pulso da operação" (entregas no prazo, tempo de ciclo). Reforça "esse cara mede resultado". Se ameaçar o "menos é mais", vai pra Fase Produto.

### Fase Produto — o produto completo (depois de contratado / pra vender)
- **Toolbox completo** — todas as ferramentas como irmãs separadas.
- **Solicitações com aprovação em níveis** (férias, reembolso, compras) + SLA.
- **Pulso da operação completo** — indicadores agregados da empresa.
- **Comunicação** — canal de contato registrado por cargo (Gerente/Coordenador/RH/Outros), com o canal do RH sigiloso. *(Ideia levantada e conscientemente adiada; revisitar quando o motivo for vender.)*
- **Memória** — central de procedimentos (POPs) e onboarding em trilha.
- **Tecido** — mural e reconhecimento de entregas (cuida da solidão, a maior dor de quem trabalha remoto).
- **Relatório mensal automático** — o Dash Top narrando resultado com texto de analista.
- **Multiempresa / configurável** — o que transforma "nosso sistema" em SaaS vendável para PMEs.

---

## 6. Stack e hospedagem

Cloudflare (plano gratuito), respeitando o isolamento de falhas:

- **Pages** — frontend de cada irmã (estático, com a identidade da marca).
- **Workers** — backend, autenticação e a API de contrato entre as irmãs.
- **D1 (SQLite)** — um banco por irmã. Bancos separados = falha isolada.
- **Deploys independentes** por subdomínio (ex.: `fluxo.oonatech...`, `agenda.oonatech...`).
- Sem cold start relevante; SSL nativo; segredos em variáveis de ambiente.

---

## 7. Ordem de construção (engenharia reversa)

Da estrela-guia até o primeiro tijolo, construindo de baixo pra cima. Cada item é um **bloco fechado**: aprovado antes, implementado, e nunca mais remexido.

1. **Fase 0 — Espinha:** banco, autenticação, RBAC, auditoria, shell.
2. **Fluxo — núcleo:** linha horizontal, etapas, contador, semáforo, gargalo.
3. **Fluxo — corrente da tarefa:** modal com a cadeia de pessoas e o tom de assistência.
4. **Desempenho Individual:** dashboard padronizado com a régua da própria média.
5. **Landing de 20 segundos:** a tese antes do login.
6. **Agenda plugada:** a primeira irmã separada, conectada por API.
7. **Dados demo + acabamento:** os três cargos, polimento visual.

→ **Fase Recrutador entregue.** Publicar, incluir no portfólio, buscar a vaga.

Depois, e só depois, os blocos da Fase Produto — um por vez, na mesma disciplina.

---

## 8. Guarda-corpos do método (não negociáveis)

- **Mapa completo antes de qualquer linha** — este documento cumpre isso.
- **Um bloco por vez, fechado.** Sem remexer o que já ficou pronto.
- **Arquitetura antes de estética.** Aprovar a estrutura antes de decorar.
- **Sem scope creep.** Toda ideia nova vai para um "backlog do produto" — nunca para dentro do bloco atual.
- **Arquiteto dirige, implementação executa.** Cleber aprova o mockup/estrutura; a construção segue o aprovado.

---

## 9. Critério de sucesso da Fase Recrutador — a leitura de 90 segundos

O recrutador não vai instalar nada nem ler documentação. A jornada tem que se contar sozinha:

1. Cai na **landing** → entende a tese em 20 segundos.
2. Loga com um cargo demo → vê o **Fluxo** e o **gargalo** destacado. *"Dá pra saber onde tudo está sem cobrar ninguém."*
3. Troca o cargo → o acesso muda na frente dele. *"Ele entende de permissão e segurança de dados."*
4. Clica numa tarefa atrasada → vê a **corrente** e a caixa de assistência. *"Ele pensa em gente, não em vigilância."*
5. Abre o **Desempenho Individual** → a régua da própria média. *"É o gestor que eu queria ser."*
6. Percebe a **ferramenta real plugada**. *"Peraí — ele não só desenhou telas, ele construiu as ferramentas que rodam aqui. Arquiteta E entrega."*

Se essas seis batidas acontecerem, o projeto cumpriu sua função: fazer o recrutador pensar **"é disso que a gente precisa na nossa equipe"** — e chamar o Cleber.

---

## 10. Segurança e confiabilidade (prioridade máxima no build real)

No mockup a segurança é figurativa. No sistema real ela é **fundação, não recurso** — é o primeiro requisito, não o último.

**Camada de Operação & Confiabilidade** (console do Admin de sistema):
- **Backup e restauração** — rotina automática + restauração testada de verdade (backup que nunca foi restaurado não é backup).
- **Atualizações** — versionamento e implantação controlada, com rollback se algo der errado.
- **Modo de manutenção** — janela controlada, sem derrubar dados nem confundir o usuário.
- **Saúde em tempo real** — painel de status: disponibilidade, latência, erros, filas. O Admin bate o olho e sabe se o app está bem.
- **Diagnóstico / varredura** — checagem contínua de integridade, vulnerabilidades e falhas. (Traduzindo o "scanner de vírus" para o contexto web: é análise de segurança e integridade, não antivírus de desktop.)

Por **isolamento de falhas**, cada plataforma-irmã tem a própria saúde e o próprio backup — a varredura roda por peça, e o problema de uma não contamina a outra.

## 11. FMEA — qualidade aplicada ao software

Trazer o **FMEA** (a sua origem de qualidade) para dentro do projeto: mapear os modos de falha possíveis, avaliar **severidade × ocorrência × detecção**, e já deixar a ação preventiva pronta. Antecipar o problema em vez de apagar incêndio.

Isso é um diferencial raro num portfólio de desenvolvedor — quase ninguém aplica FMEA em software. Vira um **documento próprio (FMEA do Prumo)**, construído numa sessão dedicada.

---

*Fim do mapa mestre. Próximo passo: abrir o primeiro bloco — Fase 0, a Espinha.*
