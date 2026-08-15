// Gera migrations/0002_seed.sql — eventos de demonstração para os próximos dias,
// ligados por e-mail (contrato entre as irmãs), sem depender do banco do Fluxo.
import { writeFileSync } from "node:fs";

const HOJE = new Date();
const at = (dayOffset, hour, min = 0) => {
  const d = new Date(HOJE);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, min, 0, 0);
  return d.toISOString().slice(0, 16);
};
const esc = (s) => s.replace(/'/g, "''");

const EVENTS = [
  { email: "gerente@prumo.demo", name: "Você", title: "Reunião de alinhamento semanal", start: at(0, 9, 0), end: at(0, 9, 45), loc: "Sala virtual" },
  { email: "gerente@prumo.demo", name: "Você", title: "1:1 com Carla Dias", start: at(1, 14, 0), end: at(1, 14, 30), loc: "Sala virtual" },
  { email: "gerente@prumo.demo", name: "Você", title: "Revisão do fechamento mensal", start: at(3, 10, 0), end: at(3, 11, 0), loc: "Sala virtual" },
  { email: "carla@prumo.demo", name: "Carla Dias", title: "1:1 com Gerente", start: at(1, 14, 0), end: at(1, 14, 30), loc: "Sala virtual" },
  { email: "carla@prumo.demo", name: "Carla Dias", title: "Aprovação de reembolsos", start: at(0, 16, 0), end: at(0, 16, 30), loc: "Sala virtual" },
  { email: "ana@prumo.demo", name: "Ana Ribeiro", title: "Consolidação — planilha de vendas", start: at(0, 11, 0), end: at(0, 12, 0), loc: "Foco" },
  { email: "ana@prumo.demo", name: "Ana Ribeiro", title: "Onboarding — novo processo de organização", start: at(2, 15, 0), end: at(2, 15, 30), loc: "Sala virtual" },
];

let sql = `-- Eventos de demonstração — Agenda.\nDELETE FROM events;\n\n`;
for (const e of EVENTS) {
  sql += `INSERT INTO events (person_email, person_name, title, start_at, end_at, location) VALUES ('${e.email}', '${esc(e.name)}', '${esc(e.title)}', '${e.start}', '${e.end}', '${esc(e.loc)}');\n`;
}

writeFileSync(new URL("../migrations/0002_seed.sql", import.meta.url), sql);
console.log("migrations/0002_seed.sql gerado —", EVENTS.length, "eventos.");
