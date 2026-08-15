import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";
import { STAGES, shapeTask, todayIsoUTC } from "../../_lib/tasks";
import type { ChainRow, TaskRow } from "../../_lib/tasks";

// GET /api/tasks — Assistente vê só as tarefas em que é o responsável atual da corrente;
// Coordenador e Gerente veem a linha inteira. Filtro aplicado no servidor, não na tela.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  const [{ results: taskRows }, { results: chainRows }] = await Promise.all([
    env.DB.prepare("SELECT * FROM tasks ORDER BY id").all<TaskRow>(),
    env.DB
      .prepare(
        `SELECT tc.task_id, tc.position, tc.user_id, tc.step_label, u.name
         FROM task_chain tc JOIN users u ON u.id = tc.user_id
         ORDER BY tc.task_id, tc.position`
      )
      .all<ChainRow>(),
  ]);

  const today = todayIsoUTC();
  let shaped = (taskRows ?? []).map((r) => shapeTask(r, chainRows ?? [], today));

  if (user.role === "assistente") {
    shaped = shaped.filter((t) => t.owner?.userId === user.id);
  }

  return json({ tasks: shaped, stages: STAGES });
};

// POST /api/tasks — cria uma tarefa nova na Fila (ou etapa escolhida), com um responsável inicial.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  let body: { title?: string; stage?: string; dueDate?: string; responsavelId?: number; tool?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corpo da requisição inválido." }, 400);
  }

  const title = (body.title ?? "").trim();
  const stage = body.stage ?? "Fila";
  const dueDate = body.dueDate ?? "";
  const responsavelId = Number(body.responsavelId);
  const tool = body.tool?.trim() || null;

  if (!title || !dueDate || !responsavelId) {
    return json({ error: "Informe título, prazo e responsável." }, 400);
  }
  if (!STAGES.slice(0, 3).includes(stage as (typeof STAGES)[number])) {
    return json({ error: "Etapa inicial inválida." }, 400);
  }

  const responsavel = await env.DB.prepare("SELECT id, name FROM users WHERE id = ?").bind(responsavelId).first<{ id: number; name: string }>();
  if (!responsavel) return json({ error: "Responsável não encontrado." }, 400);

  const today = todayIsoUTC();
  const insert = await env.DB
    .prepare(
      `INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)`
    )
    .bind(title, stage, tool, dueDate, today, today, user.id)
    .run();

  const taskId = insert.meta.last_row_id;
  await env.DB
    .prepare("INSERT INTO task_chain (task_id, position, user_id, step_label) VALUES (?, 0, ?, ?)")
    .bind(taskId, responsavel.id, stage)
    .run();

  await logAudit(env, {
    userId: user.id,
    actorName: user.name,
    action: "criou_tarefa",
    target: `${title} — responsável: ${responsavel.name}`,
  });

  return json({ id: taskId }, 201);
};
