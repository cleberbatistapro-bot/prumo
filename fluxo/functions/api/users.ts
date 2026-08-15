import type { Env } from "../_lib/types";
import { json } from "../_lib/types";
import { currentUser } from "../_lib/session";
import { logAudit } from "../_lib/audit";

// Lista de usuários e cargos — só Gerente. Prova o RBAC funcionando de verdade, não só na tela.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  if (user.role !== "gerente") {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: "GET /api/users" });
    return json({ error: "Acesso restrito ao cargo Gerente." }, 403);
  }

  const { results } = await env.DB.prepare(
    "SELECT id, name, email, role, created_at FROM users ORDER BY role, name"
  ).all();
  return json({ rows: results });
};
