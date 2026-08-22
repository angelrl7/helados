-- =====================================================================
--  HELADÓMETRO 🍦  —  Setup completo de Supabase
--  Pegá TODO esto en:  Supabase Dashboard -> SQL Editor -> New query -> Run
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) TABLA "helados"
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

create table if not exists public.helados (
  id          uuid        primary key default gen_random_uuid(),
  persona     text        not null,
  heladeria   text        not null,
  sabores     text        not null,
  puntuacion  int         not null check (puntuacion between 1 and 5),
  foto_url    text,
  resena      text,
  created_at  timestamptz not null default now()
);

-- El feed y el resumen mensual ordenan/filtran siempre por fecha.
create index if not exists helados_created_at_idx on public.helados (created_at desc);
create index if not exists helados_persona_idx    on public.helados (persona);

-- ---------------------------------------------------------------------
-- 2) ROW LEVEL SECURITY
--    La app no tiene login: entra con la anon key y son sólo 2 personas
--    de confianza, así que damos permiso completo al rol "anon".
--    (Si algún día querés cerrarlo, acá es donde se ajusta.)
-- ---------------------------------------------------------------------
alter table public.helados enable row level security;

drop policy if exists "helados_select_anon" on public.helados;
create policy "helados_select_anon"
  on public.helados for select
  to anon, authenticated
  using (true);

drop policy if exists "helados_insert_anon" on public.helados;
create policy "helados_insert_anon"
  on public.helados for insert
  to anon, authenticated
  with check (true);

drop policy if exists "helados_update_anon" on public.helados;
create policy "helados_update_anon"
  on public.helados for update
  to anon, authenticated
  using (true) with check (true);

drop policy if exists "helados_delete_anon" on public.helados;
create policy "helados_delete_anon"
  on public.helados for delete
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------
-- 3) STORAGE — bucket público "fotos-helados"
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos-helados', 'fotos-helados', true)
on conflict (id) do update set public = true;

drop policy if exists "fotos_helados_select" on storage.objects;
create policy "fotos_helados_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'fotos-helados');

drop policy if exists "fotos_helados_insert" on storage.objects;
create policy "fotos_helados_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'fotos-helados');

drop policy if exists "fotos_helados_update" on storage.objects;
create policy "fotos_helados_update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'fotos-helados') with check (bucket_id = 'fotos-helados');

drop policy if exists "fotos_helados_delete" on storage.objects;
create policy "fotos_helados_delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'fotos-helados');
