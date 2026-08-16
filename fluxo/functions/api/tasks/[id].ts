import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";
import { STAGES, shapeTask, todayIsoUTC } from "../../_lib/tasks";
import type { ChainRow, TaskRow } from "../../_lib/tasks";

const CAN_MANAGE = new Set(["coordenador", "gerente"]);

async function loadChain(env: Env, id: number) {
  return env.DB
    .prepare(
      `SELECT tc.task_id, tc.position, tc.user_id, tc.step_label, tc.due_date, tc.tool, u.name
       FROM task_chain tc JOIN users u ON u.id = tc.user_id
       WHERE tc.task_id = ? ORDER BY tc.position`
    )
    .bind(id)
    .all<ChainRow>();
}

// GET /api/tasks/:id — a corrente completa de uma tarefa (para o modal de assistência).
export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  const id = Number(params.id);
  const task = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<TaskRow>();
  if (!task) return json({ error: "Tarefa não encontrada." }, 404);

  const { results: chainRows } = await loadChain(env, id);
  const shaped = shapeTask(task, chainRows ?? [], todayIsoUTC());

  if (user.role === "assistente" && shaped.owner?.userId !== user.id) {
    return json({ error: "Você só pode ver tarefas em que é o responsável atual." }, 403);
  }

  return json({ task: shaped });
};

// PATCH /api/tasks/:id — edita título, etapa e o prazo/ferramenta da etapa ATUAL da corrente.
// Não reescreve o histórico já percorrido — só o passo em que a tarefa está agora.
// Só Coordenador e Gerente, mesma régua de quem desenha o processo.
export const onRequestPatch: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  if (!CAN_MANAGE.has(user.role)) {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: `PATCH /api/tasks/${params.id}` });
    return json({ error: "Só Coordenador e Gerente podem editar tarefas." }, 403);
  }

  const id = Number(params.id);
  const task = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<TaskRow>();
  if (!task) return json({ error: "Tarefa não encontrada." }, 404);
  if (task.done) return json({ error: "Tarefa já entregue não pode ser editada." }, 400);

  let body: { title?: string; stage?: string; dueDate?: string; tool?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corpo da requisição inválido." }, 400);
  }

  const title = (body.title ?? "").trim();
  const stage = body.stage ?? task.stage;
  const dueDate = body.dueDate ?? "";
  const tool = body.tool?.trim() || null;

  if (!title || !dueDate) return json({ error: "Informe título e prazo." }, 400);
  if (!STAGES.slice(0, 3).includes(stage as (typeof STAGES)[number])) {
    return json({ error: "Etapa inválida." }, 400);
  }

  const today = todayIsoUTC();
  const stageChanged = stage !== task.stage;
  await env.DB
    .prepare(
      `UPDATE tasks SET title = ?, stage = ?, due_date = ?, tool = ?, stage_entered_at = ?
       WHERE id = ?`
    )
    .bind(title, stage, dueDate, tool, stageChanged ? today : task.stage_entered_at, id)
    .run();

  await env.DB
    .prepare("UPDATE task_chain SET due_date = ?, tool = ? WHERE task_id = ? AND position = ?")
    .bind(dueDate, tool, id, task.current_position)
    .run();

  await logAudit(env, { userId: user.id, actorName: user.name, action: "editou_tarefa", target: title });

  const { results: chainRows } = await loadChain(env, id);
  const updated = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first<TaskRow>();
  return json({ task: shapeTask(updated as TaskRow, chainRows ?? [], today) });
};

// DELETE /api/tasks/:id — remove a tarefa e sua corrente. Confirmação fica a cargo da tela;
// aqui é só a ação final. Só Coordenador e Gerente.
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  if (!CAN_MANAGE.has(user.role)) {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: `DELETE /api/tasks/${params.id}` });
    return json({ error: "Só Coordenador e Gerente podem excluir tarefas." }, 403);
  }

  const id = Number(params.id);
  const task = await env.DB.prepare("SELECT title FROM tasks WHERE id = ?").bind(id).first<{ title: string }>();
  if (!task) return json({ error: "Tarefa não encontrada." }, 404);

  await env.DB.prepare("DELETE FROM task_chain WHERE task_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();

  await logAudit(env, { userId: user.id, actorName: user.name, action: "excluiu_tarefa", target: task.title });

  return json({ ok: true });
};
