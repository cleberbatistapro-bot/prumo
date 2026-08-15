// Gera migrations/0002_seed.sql com usuários de demonstração (os 3 cargos).
// PBKDF2-SHA256, mesmo algoritmo usado em runtime pelas Functions (Web Crypto),
// então o hash gerado aqui em Node bate com o verificado depois no Worker.
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";

const ITER = 100_000;
const KEYLEN = 32; // bytes

function hashPassword(password) {
  const saltBuf = randomBytes(16);
  const salt = saltBuf.toString("hex");
  // salt entra como bytes decodificados do hex (não a string em si) — tem que bater
  // com fromHex(saltHex) usado em functions/_lib/crypto.ts no runtime de Workers.
  const hash = pbkdf2Sync(password, saltBuf, ITER, KEYLEN, "sha256").toString("hex");
  return { salt, hash };
}

const DEMO_PASSWORD = "Prumo@123"; // senha única de demonstração — nunca usar em produção

const USERS = [
  { name: "Ana Ribeiro", email: "ana@prumo.demo", role: "assistente" },
  { name: "Carla Dias", email: "carla@prumo.demo", role: "coordenador" },
  { name: "Você", email: "gerente@prumo.demo", role: "gerente" },
  // Equipe da linha de produção — participam da corrente das tarefas (Fase 2).
  { name: "Pedro Alves", email: "pedro@prumo.demo", role: "coordenador" },
  { name: "Diana Souza", email: "diana@prumo.demo", role: "assistente" },
  { name: "Márcia Reis", email: "marcia@prumo.demo", role: "assistente" },
  { name: "Bruno Melo", email: "bruno@prumo.demo", role: "assistente" },
  { name: "Marcelo Nunes", email: "marcelo@prumo.demo", role: "assistente" },
  { name: "Carlos Lima", email: "carlos@prumo.demo", role: "assistente" },
];

const esc = (s) => s.replace(/'/g, "''");

let sql = `-- Dados de demonstração — Fase Recrutador. Senha única (demo): ${DEMO_PASSWORD}\n`;
// ordem de dependência: tudo que referencia users precisa ser limpo antes de recriar users.
sql += `DELETE FROM audit_log;\n`;
sql += `DELETE FROM sessions;\n`;
sql += `DELETE FROM attendance_days;\n`;
sql += `DELETE FROM performance_monthly;\n`;
sql += `DELETE FROM task_chain;\n`;
sql += `DELETE FROM tasks;\n`;
sql += `DELETE FROM users;\n\n`;
for (const u of USERS) {
  const { salt, hash } = hashPassword(DEMO_PASSWORD);
  sql += `INSERT INTO users (name, email, password_hash, salt, role) VALUES ('${esc(u.name)}', '${esc(u.email)}', '${hash}', '${salt}', '${u.role}');\n`;
}

writeFileSync(new URL("../migrations/0002_seed.sql", import.meta.url), sql);
console.log("migrations/0002_seed.sql gerado. Senha de demonstração:", DEMO_PASSWORD);
