import type { Env } from "./types";

interface AuditInput {
  userId: number | null;
  actorName: string;
  action: string;
  target?: string;
}

/** Registro imutável: só INSERT. Nada na aplicação faz UPDATE/DELETE em audit_log. */
export async function logAudit(env: Env, input: AuditInput): Promise<void> {
  await env.DB.prepare("INSERT INTO audit_log (user_id, actor_name, action, target) VALUES (?, ?, ?, ?)")
    .bind(input.userId, input.actorName, input.action, input.target ?? null)
    .run();
}
