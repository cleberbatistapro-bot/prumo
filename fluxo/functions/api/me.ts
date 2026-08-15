import type { Env } from "../_lib/types";
import { json } from "../_lib/types";
import { currentUser } from "../_lib/session";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const user = await currentUser(request, env);
  if (!user) return json({ error: "Não autenticado." }, 401);
  return json({ user });
};
