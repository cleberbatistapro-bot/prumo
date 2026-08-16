import type { Env } from "../../../_lib/types";
import { json } from "../../../_lib/types";
import { currentUser } from "../../../_lib/session";
import { logAudit } from "../../../_lib/audit";
import { shapeTask, todayIsoUTC } from "../../../_lib/tasks";
import type { ChainRow, TaskRow } from "../../../_lib/tasks";

const CAN_MANAGE = new Set(["coordenador", "gerente"]);

// POST /api/tasks/:id/advance — "Concluí minha etapa": passa a tarefa para a próxima
// pessoa da corrente, ou entrega de vez se quem concluiu é a última pessoa.
// Quem pode: a própria pessoa que está com a tarefa agora, ou Coordenador/Gerente
// (assistência/correção de curso) — nunca alguém de fora da corrente.
export const onRequestPost: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  const id = Number(params.id);
  const task = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<TaskRow>();
  if (!task) return json({ error: "Tarefa não encontrada." }, 404);
  if (task.done) return json({ error: "Tarefa já foi entregue." }, 400);

  const { results: chainRows } = await env.DB
    .prepare(
      `SELECT tc.task_id, tc.position, tc.user_id, tc.step_label, tc.due_date, tc.tool, u.name
       FROM task_chain tc JOIN users u ON u.id = tc.user_id
       WHERE tc.task_id = ? ORDER BY tc.position`
    )
    .bind(id)
    .all<ChainRow>();
  const chain = chainRows ?? [];
  const current = chain[task.current_position];

  const isCurrentOwner = current?.user_id === user.id;
  if (!isCurrentOwner && !CAN_MANAGE.has(user.role)) {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: `POST /api/tasks/${id}/advance` });
    return json({ error: "Só quem está com a tarefa agora (ou Coordenador/Gerente) pode avançá-la." }, 403);
  }

  const today = todayIsoUTC();
  const isLastStep = task.current_position >= chain.length - 1;

  if (isLastStep) {
    await env.DB
      .prepare("UPDATE tasks SET done = 1, stage = 'Entregue', due_date = NULL, stage_entered_at = ? WHERE id = ?")
      .bind(today, id)
      .run();
    await logAudit(env, { userId: user.id, actorName: user.name, action: "concluiu_tarefa", target: task.title });
  } else {
    const nextPosition = task.current_position + 1;
    await env.DB
      .prepare("UPDATE tasks SET current_position = ?, stage_entered_at = ? WHERE id = ?")
      .bind(nextPosition, today, id)
      .run();
    const next = chain[nextPosition];
    await logAudit(env, {
      userId: user.id,
      actorName: user.name,
      action: "avancou_tarefa",
      target: `${task.title} — passou para ${next?.name ?? "próxima etapa"}`,
    });
  }

  const updated = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<TaskRow>();
  return json({ task: shapeTask(updated as TaskRow, chain, today) });
};
