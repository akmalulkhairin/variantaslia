type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export type RsvpPayload = {
  name: string;
  attendance: 'yes' | 'no';
  guests: number | null;
  lang: 'en' | 'id';
  turnstileToken: string;
};

export type WishPayload = {
  name: string;
  message: string;
  lang: 'en' | 'id';
  turnstileToken: string;
};

const REQUIRED_ERROR = 'Please complete the required fields.';

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanLang(value: unknown): 'en' | 'id' {
  return value === 'en' ? 'en' : 'id';
}

export function validateRsvpPayload(input: Record<string, unknown>): Result<RsvpPayload> {
  const name = cleanText(input.name, 80);
  const attendance = input.attendance;
  const turnstileToken = cleanText(input.turnstileToken, 2048);
  const guestsRaw = input.guests;
  const guests = guestsRaw === undefined || guestsRaw === null || guestsRaw === ''
    ? null
    : Number(guestsRaw);

  if (!name || !turnstileToken || (attendance !== 'yes' && attendance !== 'no')) {
    return { ok: false, error: REQUIRED_ERROR };
  }

  if (attendance === 'yes' && (!Number.isInteger(guests) || guests === null || guests < 1 || guests > 10)) {
    return { ok: false, error: 'Please enter a guest count between 1 and 10.' };
  }

  return {
    ok: true,
    data: {
      name,
      attendance,
      guests: attendance === 'yes' ? guests : null,
      lang: cleanLang(input.lang),
      turnstileToken,
    },
  };
}

export function validateWishPayload(input: Record<string, unknown>): Result<WishPayload> {
  const name = cleanText(input.name, 80);
  const message = cleanText(input.message, 400);
  const turnstileToken = cleanText(input.turnstileToken, 2048);

  if (!name || !message || !turnstileToken) {
    return { ok: false, error: REQUIRED_ERROR };
  }

  if (typeof input.message === 'string' && input.message.trim().length > 400) {
    return { ok: false, error: 'Please keep the message under 400 characters.' };
  }

  return {
    ok: true,
    data: {
      name,
      message,
      lang: cleanLang(input.lang),
      turnstileToken,
    },
  };
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' && !Array.isArray(body) ? body as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function getClientMeta(request: Request) {
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const userAgent = request.headers.get('User-Agent') || '';
  return { ip, userAgent };
}

export async function verifyTurnstile(token: string, secret: string, ip?: string): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const result = await response.json() as { success?: boolean; 'error-codes'?: string[] };
  if (result.success !== true) {
    console.warn('Turnstile verification failed', {
      errorCodes: result['error-codes'] || [],
      responseStatus: response.status,
    });
  }
  return result.success === true;
}

type SupabaseEnv = {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

export async function insertSupabaseRow(env: SupabaseEnv, table: string, row: Record<string, unknown>) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return { ok: false, error: 'Supabase environment variables are not configured.' };
  }

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    return { ok: false, error: 'Unable to save your submission right now.' };
  }

  return { ok: true };
}
