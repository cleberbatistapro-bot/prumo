import { randomHex, sha256Hex } from "./crypto";
import type { Env, PublicUser, UserRow } from "./types";
import { publicUser } from "./types";

const COOKIE_NAME = "prumo_session";
const SESSION_HOURS = 8;

export async function createSession(db: D1Database, userId: number): Promise<string> {
  const token = randomHex(32);
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600_000).toISOString();
  await db
    .prepare("INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
    .bind(userId, tokenHash, expiresAt)
    .run();
  return token;
}

export async function destroySessionByToken(db: D1Database, token: string): Promise<void> {
  const tokenHash = await sha256Hex(token);
  await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_HOURS * 3600}`;
}

export function clearedCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

/** Resolve o usuário autenticado a partir do cookie da requisição. Autorização sempre no servidor. */
export async function currentUser(request: Request, env: Env): Promise<PublicUser | null> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(
    `SELECT u.* FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > datetime('now')`
  )
    .bind(tokenHash)
    .first<UserRow>();
  return row ? publicUser(row) : null;
}

export function getRawToken(request: Request): string | null {
  return readCookie(request, COOKIE_NAME);
}
