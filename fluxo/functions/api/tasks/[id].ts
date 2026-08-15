import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser } from "../../_lib/session";
import { shapeTask, todayIsoUTC } from "../../_lib/tasks";
import type { ChainRow, TaskRow } from "../../_lib/tasks";

// GET /api/tasks/:id — a corrente completa de uma tarefa (para o modal de assistência).
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  const id = Number(params.id);
  const task = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<TaskRow>();
  if (!task) return json({ error: "Tarefa não encontrada." }, 404);

  const { results: chainRows } = await env.DB
    .prepare(
      `SELECT tc.task_id, tc.position, tc.user_id, tc.step_label, u.name
       FROM task_chain tc JOIN users u ON u.id = tc.user_id
       WHERE tc.task_id = ? ORDER BY tc.position`
    )
    .bind(id)
    .all<ChainRow>();

  const shaped = shapeTask(task, chainRows ?? [], todayIsoUTC());

  if (user.role === "assistente" && shaped.owner?.userId !== user.id) {
    return json({ error: "Você só pode ver tarefas em que é o responsável atual." }, 403);
  }

  return json({ task: shaped });
};
