alter table public.links rename to bookmarks;
alter index public.links_folder_id_idx rename to bookmarks_folder_id_idx;
alter table public.bookmarks rename constraint links_folder_id_fkey to bookmarks_folder_id_fkey;
