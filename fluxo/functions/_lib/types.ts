export interface Env {
  DB: D1Database;
}

export type Role = "assistente" | "coordenador" | "gerente";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  role: Role;
  created_at: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export function publicUser(u: UserRow): PublicUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export function json(data: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
  if (extraHeaders) new Headers(extraHeaders).forEach((v, k) => headers.set(k, v));
  return new Response(JSON.stringify(data), { status, headers });
}
