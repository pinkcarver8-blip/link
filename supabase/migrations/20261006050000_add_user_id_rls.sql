-- 사용자별 데이터 분리: user_id 컬럼 + RLS
-- 기존 행은 user_id가 null이라 누구에게도 보이지 않는다.
alter table public.folders
  add column if not exists user_id uuid default auth.uid()
  references auth.users (id) on delete cascade;
alter table public.bookmarks
  add column if not exists user_id uuid default auth.uid()
  references auth.users (id) on delete cascade;

create index if not exists folders_user_id_idx on public.folders (user_id);
create index if not exists bookmarks_user_id_idx on public.bookmarks (user_id);

alter table public.folders enable row level security;
alter table public.bookmarks enable row level security;

create policy "own folders" on public.folders
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own bookmarks" on public.bookmarks
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
