alter table public.bookmarks add column if not exists folder_id bigint;
alter table public.bookmarks drop constraint if exists bookmarks_folder_id_fkey;
alter table public.bookmarks
  add constraint bookmarks_folder_id_fkey
  foreign key (folder_id) references public.folders(id) on delete set null;
create index if not exists bookmarks_folder_id_idx on public.bookmarks(folder_id);
