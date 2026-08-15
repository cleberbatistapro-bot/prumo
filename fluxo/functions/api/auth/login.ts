import type { Env, UserRow } from "../../_lib/types";
import { json } from "../../_lib/types";
import { verifyPassword } from "../../_lib/crypto";
import { createSession, sessionCookie } from "../../_lib/session";
import { logAudit } from "../../_lib/audit";

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

  const ok = await verifyPassword(password, user.salt, user.password_hash);
  if (!ok) {
    await logAudit(env, { userId: user.id, actorName: user.name, action: "login_falhou", target: "senha incorreta" });
    return json({ error: "E-mail ou senha inválidos." }, 401);
  }

  const token = await createSession(env.DB, user.id);
  await logAudit(env, { userId: user.id, actorName: user.name, action: "login", target: `cargo: ${user.role}` });

  return json(
    { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    200,
    { "Set-Cookie": sessionCookie(token) }
  );
};
