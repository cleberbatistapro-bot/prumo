import type { Env } from "../_lib/types";
import { json } from "../_lib/types";
import { currentUser } from "../_lib/session";

// Lista enxuta (id + nome) para preencher o seletor de responsável ao criar tarefa.
// Qualquer pessoa autenticada pode ver — não é dado sensível como em /api/users.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  const { results } = await env.DB.prepare("SELECT id, name FROM users ORDER BY name").all();
  return json({ rows: results });
};
