create table public.folders (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.bookmarks (
  id bigint generated always as identity primary key,
  url text not null,
  title text,
  description text,
  thumbnail_url text,
  folder_id bigint references public.folders (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index bookmarks_folder_id_idx on public.bookmarks (folder_id);

alter table public.folders disable row level security;
alter table public.bookmarks disable row level security;

-- 기존 localhost 데이터 이전 (이름/URL 기준 중복 방지)
insert into public.folders (name)
select v.name
from (values ('개발'), ('디자인'), ('뉴스')) as v(name)
where not exists (select 1 from public.folders f where f.name = v.name);

insert into public.bookmarks (title, url, folder_id)
select v.title, v.url, (select f.id from public.folders f where f.name = v.folder order by f.id limit 1)
from (values
  ('Next.js Docs', 'https://nextjs.org/docs', '개발'),
  ('MDN Web Docs', 'https://developer.mozilla.org', '개발'),
  ('Tailwind CSS', 'https://tailwindcss.com', '디자인'),
  ('Figma', 'https://www.figma.com', '디자인'),
  ('Hacker News', 'https://news.ycombinator.com', '뉴스'),
  ('GeekNews', 'https://news.hada.io', '뉴스')
) as v(title, url, folder)
where not exists (select 1 from public.bookmarks b where b.url = v.url);
