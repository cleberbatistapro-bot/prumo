import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";
import { shapeMember } from "../../_lib/performance";
import type { MonthRow } from "../../_lib/performance";

// GET /api/performance/:id — dashboard completo de uma pessoa. Só Gerente.
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  if (user.role !== "gerente") {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: `GET /api/performance/${params.id}` });
    return json({ error: "Acesso restrito ao cargo Gerente." }, 403);
  }

  const targetId = Number(params.id);
  const person = await env.DB.prepare("SELECT id, name, role FROM users WHERE id = ?").bind(targetId).first<{ id: number; name: string; role: string }>();
  if (!person) return json({ error: "Pessoa não encontrada." }, 404);

  const { results: months } = await env.DB
    .prepare("SELECT * FROM performance_monthly WHERE user_id = ? ORDER BY month_order")
    .bind(targetId)
    .all<MonthRow>();
  if (!months || months.length === 0) return json({ error: "Sem dados de desempenho para esta pessoa." }, 404);

  const { results: attendance } = await env.DB
    .prepare("SELECT day_index, checkin_min FROM attendance_days WHERE user_id = ? ORDER BY day_index")
    .bind(targetId)
    .all<{ day_index: number; checkin_min: number }>();

  const shaped = shapeMember(person.name, person.role, person.id, months);
  const baselineCheckin = Math.round(
    months.slice(0, -1).reduce((a, m) => a + m.checkin_avg_min, 0) / Math.max(1, months.length - 1)
  );

  return json({
    member: shaped,
    ponto: { baseline: baselineCheckin, days: (attendance ?? []).map((a) => a.checkin_min) },
  });
};
