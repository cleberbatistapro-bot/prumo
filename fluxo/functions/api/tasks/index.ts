import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";
import { STAGES, shapeTask, todayIsoUTC } from "../../_lib/tasks";
import type { ChainRow, TaskRow } from "../../_lib/tasks";

const CAN_MANAGE = new Set(["coordenador", "gerente"]);

// GET /api/tasks — Assistente vê só as tarefas em que é o responsável atual da corrente;
// Coordenador e Gerente veem a linha inteira. Filtro aplicado no servidor, não na tela.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  const [{ results: taskRows }, { results: chainRows }] = await Promise.all([
    env.DB.prepare("SELECT * FROM tasks ORDER BY id").all<TaskRow>(),
    env.DB
      .prepare(
        `SELECT tc.task_id, tc.position, tc.user_id, tc.step_label, tc.due_date, tc.tool, u.name
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

interface ChainStepInput {
  responsavelId?: number;
  step?: string;
  dueDate?: string;
  tool?: string;
}

// POST /api/tasks — cria uma tarefa com a corrente inteira já montada (um ou mais passos).
// Só Coordenador e Gerente desenham o processo; Assistente executa dentro do que foi definido.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  if (!CAN_MANAGE.has(user.role)) {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "acesso_negado", target: "POST /api/tasks" });
    return json({ error: "Só Coordenador e Gerente podem criar tarefas." }, 403);
  }

  let body: { title?: string; stage?: string; chain?: ChainStepInput[] };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corpo da requisição inválido." }, 400);
  }

  const title = (body.title ?? "").trim();
  const stage = body.stage ?? "Fila";
  const chainInput = Array.isArray(body.chain) ? body.chain : [];

  if (!title) return json({ error: "Informe o título da tarefa." }, 400);
  if (!STAGES.slice(0, 3).includes(stage as (typeof STAGES)[number])) {
    return json({ error: "Etapa inicial inválida." }, 400);
  }
  if (!chainInput.length) return json({ error: "Adicione ao menos um responsável na corrente." }, 400);

  const cleanChain: { userId: number; step: string; dueDate: string; tool: string | null }[] = [];
  for (const step of chainInput) {
    const userId = Number(step.responsavelId);
    const stepName = (step.step ?? "").trim();
    const dueDate = step.dueDate ?? "";
    if (!userId || !stepName || !dueDate) {
      return json({ error: "Cada pessoa da corrente precisa de responsável, nome da etapa e prazo." }, 400);
    }
    cleanChain.push({ userId, step: stepName, dueDate, tool: step.tool?.trim() || null });
  }

  const ids = cleanChain.map((c) => c.userId);
  const placeholders = ids.map(() => "?").join(",");
  const { results: people } = await env.DB.prepare(`SELECT id, name FROM users WHERE id IN (${placeholders})`).bind(...ids).all<{ id: number; name: string }>();
  const peopleById = new Map((people ?? []).map((p) => [p.id, p.name]));
  for (const id of ids) {
    if (!peopleById.has(id)) return json({ error: "Responsável não encontrado." }, 400);
  }

  const today = todayIsoUTC();
  const first = cleanChain[0];
  const insert = await env.DB
    .prepare(
      `INSERT INTO tasks (title, stage, tool, due_date, opened_at, stage_entered_at, current_position, done, created_by)
       VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)`
    )
    .bind(title, stage, first.tool, first.dueDate, today, today, user.id)
    .run();

  const taskId = insert.meta.last_row_id;
  for (let i = 0; i < cleanChain.length; i++) {
    const c = cleanChain[i];
    await env.DB
      .prepare("INSERT INTO task_chain (task_id, position, user_id, step_label, due_date, tool) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(taskId, i, c.userId, c.step, c.dueDate, c.tool)
      .run();
  }

  await logAudit(env, {
    userId: user.id,
    actorName: user.name,
    action: "criou_tarefa",
    target: `${title} — corrente com ${cleanChain.length} pessoa(s), início: ${peopleById.get(first.userId)}`,
  });

  return json({ id: taskId }, 201);
};
