import type { Env as BaseEnv } from "../_lib/types";
import { json } from "../_lib/types";
import { currentUser } from "../_lib/session";

interface Env extends BaseEnv {
  AGENDA_URL: string;
  AGENDA_SHARED_KEY: string;
}

// GET /api/agenda — o Fluxo pede "me dá a agenda dessa pessoa" pra plataforma-irmã.
// A chave de contrato fica só aqui no servidor; o navegador nunca vê o segredo nem
// fala direto com a Agenda. Se a Agenda cair, devolvemos "indisponível" — sem derrubar
// o Fluxo junto (isolamento de falhas, seção 3 do mapa mestre).
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);

  try {
    const upstream = await fetch(`${env.AGENDA_URL}/api/events?person=${encodeURIComponent(user.email)}`, {
      headers: { "X-Prumo-Key": env.AGENDA_SHARED_KEY },
      signal: AbortSignal.timeout(4000),
    });
    if (!upstream.ok) return json({ available: false });
    const data = await upstream.json<{ events: unknown[] }>();
    return json({ available: true, events: data.events });
  } catch {
    return json({ available: false });
  }
};
