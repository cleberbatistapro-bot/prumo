import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";
import { shapeMember } from "../../_lib/performance";
import type { MonthRow } from "../../_lib/performance";

// GET /api/performance — lista enxuta (id, nome, cargo, sit) pro seletor de membro.
// Só Gerente. É a régua da assistência: nunca ranking, só o sinal de desvio de cada um.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  if (user.role !== "gerente") {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: "GET /api/performance" });
    return json({ error: "Acesso restrito ao cargo Gerente." }, 403);
  }

  const { results } = await env.DB.prepare(
    `SELECT u.id AS user_id, u.name, u.role, pm.* FROM performance_monthly pm
     JOIN users u ON u.id = pm.user_id ORDER BY u.name, pm.month_order`
  ).all<{ user_id: number; name: string; role: string } & MonthRow>();

  const byUser = new Map<number, { id: number; name: string; role: string; months: MonthRow[] }>();
  for (const r of results ?? []) {
    if (!byUser.has(r.user_id)) byUser.set(r.user_id, { id: r.user_id, name: r.name, role: r.role, months: [] });
    byUser.get(r.user_id)!.months.push(r);
  }

  const members = [...byUser.values()].map((u) => {
    const m = shapeMember(u.name, u.role, u.id, u.months);
    return { id: m.id, name: m.name, role: m.role, sit: m.sit };
  });

  return json({ members });
};
