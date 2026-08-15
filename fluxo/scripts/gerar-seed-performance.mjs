// Gera migrations/0006_seed_performance.sql — 6 meses de fechamento + 10 dias de ponto
// para os 3 casos de demonstração do bloco Desempenho Individual (um por "sit": abaixo
// do padrão / dentro do padrão / acima do padrão). Os 5 primeiros meses formam a base
// (a média dela); o 6º é o "mês atual" mostrado no dashboard.
import { writeFileSync } from "node:fs";

const MONTHS = ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
const esc = (s) => s.replace(/'/g, "''");
const userIdSub = (email) => `(SELECT id FROM users WHERE email = '${email}')`;

const PEOPLE = [
  {
    email: "diana@prumo.demo",
    on_time_pct: [95, 96, 93, 96, 95, 72],
    tasks_delivered: [22, 20, 21, 22, 20, 14],
    avg_exec_days: [2.6, 2.4, 2.5, 2.6, 2.4, 4.2],
    checkin_avg_min: [514, 510, 516, 512, 518, 556],
    attendance: [510, 516, 512, 520, 515, 513, 542, 560, 550, 556],
    signal_title: "3 indicadores abaixo da linha de base da Diana neste mês",
    signal_text:
      "A Diana costuma estar dentro da média o ano inteiro. Neste mês, pontualidade, prazo e tempo de execução caíram abaixo do padrão dela. Não é um problema de desempenho — é um sinal de que algo mudou. Antes de qualquer cobrança, vale uma conversa em particular para entender: sobrecarga, algo pessoal, ou uma tarefa que não ficou clara.",
  },
  {
    email: "bruno@prumo.demo",
    on_time_pct: [93, 91, 92, 93, 91, 93],
    tasks_delivered: [18, 17, 19, 18, 18, 19],
    avg_exec_days: [3.2, 3.0, 3.1, 3.2, 3.0, 3.0],
    checkin_avg_min: [497, 493, 496, 497, 492, 491],
    attendance: [492, 498, 494, 496, 491, 493, 497, 492, 490, 491],
    signal_title: "Bruno seguiu dentro do padrão dele o mês inteiro",
    signal_text:
      "Todos os indicadores estão na faixa habitual do Bruno. Consistência é resultado — ele entrega no ritmo esperado, sem oscilações. Nenhuma ação necessária; o painel só confirma que está tudo em ordem.",
  },
  {
    email: "marcia@prumo.demo",
    on_time_pct: [92, 90, 91, 88, 89, 99],
    tasks_delivered: [22, 20, 19, 18, 21, 27],
    avg_exec_days: [2.9, 2.5, 2.7, 2.8, 2.6, 1.9],
    checkin_avg_min: [502, 498, 500, 497, 503, 478],
    attendance: [490, 485, 492, 482, 478, 480, 475, 483, 478, 476],
    signal_title: "Márcia superou a própria média em todos os indicadores",
    signal_text:
      "Este mês a Márcia entregou mais, mais no prazo e mais rápido do que o costume dela — e vem numa curva de melhora há três meses. Esse é o tipo de sinal que costuma passar despercebido no remoto. Vale reconhecer de forma concreta e considerar para novas responsabilidades.",
  },
];

let sql = `-- Demonstração — Desempenho Individual. 6 meses fechados + 10 dias de ponto, por pessoa.\n`;
sql += `DELETE FROM attendance_days;\nDELETE FROM performance_monthly;\n\n`;

for (const p of PEOPLE) {
  const uid = userIdSub(p.email);
  MONTHS.forEach((m, i) => {
    const last = i === MONTHS.length - 1;
    const title = last ? `'${esc(p.signal_title)}'` : "NULL";
    const text = last ? `'${esc(p.signal_text)}'` : "NULL";
    sql += `INSERT INTO performance_monthly (user_id, month, month_order, on_time_pct, tasks_delivered, avg_exec_days, checkin_avg_min, signal_title, signal_text)\n`;
    sql += `  VALUES (${uid}, '${m}', ${i}, ${p.on_time_pct[i]}, ${p.tasks_delivered[i]}, ${p.avg_exec_days[i]}, ${p.checkin_avg_min[i]}, ${title}, ${text});\n`;
  });
  p.attendance.forEach((min, i) => {
    sql += `INSERT INTO attendance_days (user_id, day_index, checkin_min) VALUES (${uid}, ${i}, ${min});\n`;
  });
  sql += `\n`;
}

writeFileSync(new URL("../migrations/0006_seed_performance.sql", import.meta.url), sql);
console.log("migrations/0006_seed_performance.sql gerado —", PEOPLE.length, "pessoas x 6 meses.");
