import {
  getClientMeta,
  insertSupabaseRow,
  jsonResponse,
  readJson,
  validateWishPayload,
  verifyTurnstile,
} from '../_lib/submissions';

type Env = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
};

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const payload = validateWishPayload(await readJson(request));
  if (!payload.ok) return jsonResponse({ error: payload.error }, 400);
  if (!env.TURNSTILE_SECRET_KEY) return jsonResponse({ error: 'Turnstile is not configured.' }, 500);

  const { ip, userAgent } = getClientMeta(request);
  const verified = await verifyTurnstile(payload.data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!verified) return jsonResponse({ error: 'Please refresh and try the security check again.' }, 403);

  const saved = await insertSupabaseRow(env, 'wishes', {
    name: payload.data.name,
    message: payload.data.message,
    lang: payload.data.lang,
    user_agent: userAgent,
  });
  if (!saved.ok) return jsonResponse({ error: saved.error }, 500);

  return jsonResponse({ ok: true });
}
