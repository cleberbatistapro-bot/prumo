// Gera migrations/0004_seed_tasks.sql com as tarefas de demonstração —
// mesmo roteiro do mockup-fluxo-tarefa-v2.html, agora com datas relativas a "hoje"
// e ligadas a usuários reais (via e-mail, resolvido em runtime pela migração).
import { writeFileSync } from "node:fs";

const HOJE = new Date();
const iso = (offsetDays) => {
  const x = new Date(HOJE);
  x.setDate(x.getDate() + offsetDays);
  return x.toISOString().slice(0, 10);
};

const EMAIL = {
  MN: "marcelo@prumo.demo", MR: "marcia@prumo.demo", CL: "carlos@prumo.demo",
  DS: "diana@prumo.demo", BM: "bruno@prumo.demo", AR: "ana@prumo.demo",
  PL: "pedro@prumo.demo", CD: "carla@prumo.demo",
};

// prazo/aberto em dias relativos a hoje; "at" = posição atual na corrente (0-index)
const TASKS = [
  { t: "Consolidar planilhas de vendas", stage: "Fila", prazo: 6, aberto: -1, tool: "Proc Fácil", chain: ["AR", "CD"], at: 0 },
  { t: "Levantar documentos fiscais", stage: "Fila", prazo: 4, aberto: 0, chain: ["PL", "MR"], at: 0 },
  { t: "Organizar arquivos do projeto Alfa", stage: "Execução", prazo: 1, aberto: -3, tool: "Organizador", chain: ["AR", "DS"], at: 0 },
  { t: "Padronizar nomes de contratos", stage: "Execução", prazo: 2, aberto: -2, tool: "Renomeador", chain: ["BM", "CD"], at: 0 },
  { t: "Montar base de fornecedores", stage: "Execução", prazo: 5, aberto: -2, chain: ["AR", "CL"], at: 0 },
  { t: "Relatório mensal — Cliente X", stage: "Revisão", prazo: -1, aberto: -9, tool: "Dash Top", chain: ["MN", "MR", "CL", "DS", "BM"], at: 3 },
  { t: "Revisão do dashboard financeiro", stage: "Revisão", prazo: -2, aberto: -10, tool: "Dash Top", chain: ["MR", "CL", "DS", "BM"], at: 1 },
  { t: "Conferência de reembolsos", stage: "Revisão", prazo: 0, aberto: -5, chain: ["PL", "CD", "BM"], at: 1 },
  { t: "Aprovar planilha consolidada", stage: "Revisão", prazo: 1, aberto: -4, chain: ["AR", "BM"], at: 1 },
  { t: "Checar organização de arquivos", stage: "Revisão", prazo: 3, aberto: -3, chain: ["AR", "DS"], at: 1 },
  { t: "Fechamento semanal", stage: "Entregue", done: true, chain: ["AR", "CD"] },
  { t: "Base de clientes atualizada", stage: "Entregue", done: true, chain: ["AR", "CL"] },
];

const STAGE_STEP = { Fila: "Triagem", "Execução": "Execução", "Revisão": "Revisão", "Entregue": "Concluído" };
const esc = (s) => s.replace(/'/g, "''");
const userIdSub = (ini) => `(SELECT id FROM users WHERE email = '${EMAIL[ini]}')`;

let sql = `-- Tarefas de demonstração — Fase Recrutador. Gerado com datas relativas a ${HOJE.toISOString().slice(0, 10)}.\n`;
sql += `DELETE FROM task_chain;\nDELETE FROM tasks;\n\n`;

TASKS.forEach((task) => {
  const at = task.at ?? task.chain.length - 1;
  const done = task.done ? 1 : 0;
  const dueDate = task.done ? "NULL" : `'${iso(task.prazo)}'`;
  const openedAt = task.done ? `'${iso(-8)}'` : `'${iso(task.aberto)}'`;
  const stageEnteredAt = task.done ? `'${iso(-2)}'` : `'${iso(Math.min(0, task.aberto + at))}'`;
  const tool = task.tool ? `'${esc(task.tool)}'` : "NULL";

  sql += `INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)\n`;
  sql += `  VALUES ('${esc(task.t)}', '${task.stage}', ${tool}, ${dueDate}, ${openedAt}, ${stageEnteredAt}, ${at}, ${done}, ${userIdSub("CD")});\n`;

  const taskIdSub = `(SELECT id FROM tasks WHERE title = '${esc(task.t)}')`;
  task.chain.forEach((ini, position) => {
    sql += `INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES (${taskIdSub}, ${position}, ${userIdSub(ini)}, '${STAGE_STEP[task.stage]}');\n`;
  });
  sql += `\n`;
});

writeFileSync(new URL("../migrations/0004_seed_tasks.sql", import.meta.url), sql);
console.log("migrations/0004_seed_tasks.sql gerado —", TASKS.length, "tarefas.");
