import type { Env } from "../../_lib/types";
import { json } from "../../_lib/types";
import { currentUser, destroySessionByToken, getRawToken, clearedCookie } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  const token = getRawToken(request);
  if (token) await destroySessionByToken(env.DB, token);
  if (user) await logAudit(env, { userId: user.id, actorName: user.name, action: "logout" });
  return json({ ok: true }, 200, { "Set-Cookie": clearedCookie() });
};
