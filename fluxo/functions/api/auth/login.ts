import type { Env, UserRow } from "../../_lib/types";
import { json } from "../../_lib/types";
import { verifyPassword } from "../../_lib/crypto";
import { createSession, sessionCookie } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Corpo da requisição inválido." }, 400);
  }
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) return json({ error: "Informe e-mail e senha." }, 400);

  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<UserRow>();
  if (!user) {
    await logAudit(env, { userId: null, actorName: email, action: "login_falhou", target: "e-mail não encontrado" });
    return json({ error: "E-mail ou senha inválidos." }, 401);
  }

  // Conta travada: nem chega a verificar a senha — barra na porta mesmo com a senha certa,
  // até o tempo de bloqueio passar. É isso que torna força bruta inviável.
  if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
    const minutesLeft = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 60_000);
    await logAudit(env, { userId: user.id, actorName: user.name, action: "login_bloqueado", target: `tentativa durante bloqueio, faltam ${minutesLeft} min` });
    return json({ error: `Muitas tentativas erradas. Tente de novo em ${minutesLeft} minuto(s).` }, 429);
  }

  const ok = await verifyPassword(password, user.salt, user.password_hash);
  if (!ok) {
    const attempts = user.failed_attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString();
      await env.DB.prepare("UPDATE users SET failed_attempts = 0, locked_until = ? WHERE id = ?").bind(lockedUntil, user.id).run();
      await logAudit(env, { userId: user.id, actorName: user.name, action: "login_bloqueado", target: `${MAX_ATTEMPTS} tentativas erradas seguidas — travado por ${LOCKOUT_MINUTES} min` });
      return json({ error: `Muitas tentativas erradas. Conta travada por ${LOCKOUT_MINUTES} minutos.` }, 429);
    }
    await env.DB.prepare("UPDATE users SET failed_attempts = ? WHERE id = ?").bind(attempts, user.id).run();
    await logAudit(env, { userId: user.id, actorName: user.name, action: "login_falhou", target: `senha incorreta (${attempts}/${MAX_ATTEMPTS})` });
    return json({ error: "E-mail ou senha inválidos." }, 401);
  }

  if (user.failed_attempts > 0 || user.locked_until) {
    await env.DB.prepare("UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?").bind(user.id).run();
  }

  const token = await createSession(env.DB, user.id);
  await logAudit(env, { userId: user.id, actorName: user.name, action: "login", target: `cargo: ${user.role}` });

  return json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    200,
    { "Set-Cookie": sessionCookie(token) }
  );
};
