interface Env {
  DB: D1Database;
  AGENDA_SHARED_KEY: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

// GET /api/events?person=<email> — contrato entre irmãs: só responde com a chave certa
// no header X-Prumo-Key. Nenhuma outra plataforma-irmã enxerga as tripas da Agenda além disso.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const key = request.headers.get("X-Prumo-Key");
  if (key !== env.AGENDA_SHARED_KEY) {
    return json({ error: "Chave de integração inválida." }, 401);
  }

  const url = new URL(request.url);
  const person = url.searchParams.get("person");
  if (!person) return json({ error: "Informe o parâmetro 'person'." }, 400);

  const nowIso = new Date().toISOString().slice(0, 16);
  const { results } = await env.DB
    .prepare(
      `SELECT title, start_at, end_at, location FROM events
       WHERE person_email = ? AND start_at >= ?
       ORDER BY start_at LIMIT 5`
    )
    .bind(person, nowIso)
    .all();

  return json({ events: results ?? [] });
};
