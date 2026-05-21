create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  attendance text not null check (attendance in ('yes', 'no')),
  guests integer check (guests is null or guests between 1 and 10),
  lang text not null default 'id' check (lang in ('en', 'id')),
  user_agent text,
  created_at timestamptz not null default now(),
  check (
    (attendance = 'yes' and guests is not null)
    or (attendance = 'no' and guests is null)
  )
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  message text not null check (char_length(trim(message)) between 1 and 400),
  lang text not null default 'id' check (lang in ('en', 'id')),
  approved boolean not null default false,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;

drop policy if exists "allow public rsvp inserts" on public.rsvps;
create policy "allow public rsvp inserts"
on public.rsvps
for insert
to anon
with check (
  char_length(trim(name)) between 1 and 80
  and attendance in ('yes', 'no')
  and lang in ('en', 'id')
  and (
    (attendance = 'yes' and guests between 1 and 10)
    or (attendance = 'no' and guests is null)
  )
);

drop policy if exists "allow public wish inserts" on public.wishes;
create policy "allow public wish inserts"
on public.wishes
for insert
to anon
with check (
  char_length(trim(name)) between 1 and 80
  and char_length(trim(message)) between 1 and 400
  and lang in ('en', 'id')
  and approved = false
);
