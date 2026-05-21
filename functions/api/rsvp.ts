import {
  getClientMeta,
  insertSupabaseRow,
  jsonResponse,
  readJson,
  validateRsvpPayload,
  verifyTurnstile,
} from '../_lib/submissions';

type Env = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
};

export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const payload = validateRsvpPayload(await readJson(request));
  if (!payload.ok) return jsonResponse({ error: payload.error }, 400);
  if (!env.TURNSTILE_SECRET_KEY) return jsonResponse({ error: 'Turnstile is not configured.' }, 500);

  const { ip, userAgent } = getClientMeta(request);
  const verified = await verifyTurnstile(payload.data.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!verified) return jsonResponse({ error: 'Please refresh and try the security check again.' }, 403);

  const saved = await insertSupabaseRow(env, 'rsvps', {
    name: payload.data.name,
    attendance: payload.data.attendance,
    guests: payload.data.guests,
    lang: payload.data.lang,
    user_agent: userAgent,
  });
  if (!saved.ok) return jsonResponse({ error: saved.error }, 500);

  return jsonResponse({ ok: true });
}
