# RSVP and Wishes Forms

The site submits RSVP and wishes forms to Cloudflare Pages Functions:

- `POST /api/rsvp`
- `POST /api/wishes`

Each function verifies the Cloudflare Turnstile token, validates the payload, then inserts into Supabase using the Supabase anon key. Supabase Row Level Security still controls what the anon role may insert.

## Cloudflare Pages Variables

Set these in Cloudflare Pages under `Settings -> Variables and Secrets` for production and preview:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
TURNSTILE_SECRET_KEY
PUBLIC_TURNSTILE_SITE_KEY
```

`SUPABASE_ANON_KEY` and `PUBLIC_TURNSTILE_SITE_KEY` are public-capable values. `TURNSTILE_SECRET_KEY` must stay secret.

Do not add a Supabase service role key for these public forms. The functions intentionally use the anon key so RLS remains active.

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL Editor. It creates:

- `public.rsvps`
- `public.wishes`
- insert-only RLS policies for the `anon` role

Wishes are stored with `approved = false` by default so they can be moderated before being displayed publicly later.
