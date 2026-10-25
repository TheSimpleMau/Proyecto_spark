-- Esquema de SPARK. Pegar completo en Supabase → SQL Editor → Run.
-- Se puede volver a correr sin problema (no borra datos).

create table if not exists public.profiles (
  id uuid primary key,
  name text not null,
  emoji text not null default '⚡',
  interests text[] not null default '{}',
  is_bot boolean not null default false,
  lat double precision,
  lng double precision,
  radius int not null default 50,
  last_seen timestamptz,
  created_at timestamptz not null default now()
);

-- Un match por pareja; user_a siempre es el id menor.
-- a_accepted / b_accepted: null = sin responder, true = aceptó, false = ignoró.
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references public.profiles(id) on delete cascade,
  user_b uuid not null references public.profiles(id) on delete cascade,
  shared text[] not null,
  distance_m int,
  a_accepted boolean,
  b_accepted boolean,
  created_at timestamptz not null default now(),
  check (user_a < user_b),
  unique (user_a, user_b)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists messages_match_idx on public.messages (match_id, created_at);
create index if not exists profiles_seen_idx on public.profiles (last_seen) where not is_bot;

-- Permisos (RLS) ---------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;

drop policy if exists "perfiles visibles" on public.profiles;
create policy "perfiles visibles" on public.profiles for select to authenticated using (true);
drop policy if exists "crear mi perfil" on public.profiles;
create policy "crear mi perfil" on public.profiles for insert to authenticated
  with check (id = auth.uid() and not is_bot);
drop policy if exists "editar mi perfil" on public.profiles;
create policy "editar mi perfil" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and not is_bot);

drop policy if exists "ver mis matches" on public.matches;
create policy "ver mis matches" on public.matches for select to authenticated
  using (auth.uid() in (user_a, user_b));
drop policy if exists "crear mis matches" on public.matches;
create policy "crear mis matches" on public.matches for insert to authenticated
  with check (auth.uid() in (user_a, user_b));
-- El cliente también responde por el bot (acepta en su nombre), por eso puede editar todo el match.
drop policy if exists "responder mis matches" on public.matches;
create policy "responder mis matches" on public.matches for update to authenticated
  using (auth.uid() in (user_a, user_b));

drop policy if exists "ver mis mensajes" on public.messages;
create policy "ver mis mensajes" on public.messages for select to authenticated
  using (exists (select 1 from public.matches m where m.id = match_id and auth.uid() in (m.user_a, m.user_b)));
-- Se puede escribir como uno mismo o como el bot del match (el cliente simula sus respuestas).
drop policy if exists "enviar mensajes" on public.messages;
create policy "enviar mensajes" on public.messages for insert to authenticated
  with check (
    exists (select 1 from public.matches m where m.id = match_id and auth.uid() in (m.user_a, m.user_b))
    and (sender_id = auth.uid() or sender_id in (select id from public.profiles where is_bot))
  );

-- Tiempo real para notificaciones y chat ---------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.matches;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

-- Métricas públicas (/metricas): solo agregados, sin nombres ni mensajes ------------
create or replace function public.get_metrics()
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'real_users', (select count(*) from profiles where not is_bot),
    'active_now', (select count(*) from profiles where not is_bot and last_seen > now() - interval '2 minutes'),
    'matches_total', (select count(*) from matches),
    'matches_real', (select count(*) from matches m
                      join profiles a on a.id = m.user_a join profiles b on b.id = m.user_b
                      where not a.is_bot and not b.is_bot),
    'accepted', (select count(*) from matches where a_accepted and b_accepted),
    'declined', (select count(*) from matches where a_accepted = false or b_accepted = false),
    'messages_total', (select count(*) from messages),
    'avg_distance', (select round(avg(distance_m)) from matches),
    'by_interest', (select coalesce(json_agg(t), '[]') from (
                      select tag, count(*) as n from matches, unnest(shared) as tag
                      group by tag order by n desc limit 10) t),
    'by_hour', (select coalesce(json_agg(t), '[]') from (
                  select date_trunc('hour', created_at) as hour, count(*) as n from matches
                  where created_at > now() - interval '24 hours'
                  group by 1 order by 1) t)
  );
$$;

grant execute on function public.get_metrics() to anon, authenticated;
