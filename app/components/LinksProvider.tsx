"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Folder, LinkItem } from "../types";
import { createClient } from "../../utils/supabase/client";

type Bookmark = {
  id: number;
  title: string | null;
  url: string;
  folder_id: number | null;
};

type LinksContextValue = {
  links: LinkItem[];
  addLink: (url: string) => Promise<void>;
  updateLink: (
    id: number,
    changes: { title?: string; url?: string; folderId?: number | null },
  ) => Promise<void>;
  removeLink: (id: number) => Promise<void>;
  folders: Folder[];
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: number) => Promise<void>;
  renameFolder: (id: number, name: string) => Promise<void>;
};

const LinksContext = createContext<LinksContextValue | null>(null);

export function useLinks() {
  const ctx = useContext(LinksContext);
  if (!ctx) throw new Error("useLinks must be used within LinksProvider");
  return ctx;
}

const NO_FOLDER = "기타";

export default function LinksProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createClient());
  const [folders, setFolders] = useState<Folder[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // 로그인한 사용자가 바뀔 때마다 (RLS로 필터된) 데이터를 새로 불러온다
  useEffect(() => {
    let cancelled = false;
    let currentUserId: string | undefined;

    const load = async () => {
      const [f, b] = await Promise.all([
        supabase.from("folders").select("id, name").order("id"),
        supabase
          .from("bookmarks")
          .select("id, title, url, folder_id")
          .order("id"),
      ]);
      if (cancelled) return;
      if (f.error) console.error("folders 조회 실패", f.error);
      else setFolders(f.data);
      if (b.error) console.error("bookmarks 조회 실패", b.error);
      else setBookmarks(b.data);
    };

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id;
      if (userId === currentUserId) return;
      currentUserId = userId;
      setFolders([]);
      setBookmarks([]);
      if (userId) setTimeout(load, 0);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const links: LinkItem[] = bookmarks.map((b) => ({
    id: b.id,
    title: b.title ?? b.url,
    url: b.url,
    folder: folders.find((f) => f.id === b.folder_id)?.name ?? NO_FOLDER,
  }));

  const addLink = async (url: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .insert({ url, title: new URL(url).hostname.replace(/^www\./, "") })
      .select("id, title, url, folder_id")
      .single();
    if (error) return console.error("북마크 추가 실패", error);
    setBookmarks((prev) => [...prev, data]);
  };

  const updateLink: LinksContextValue["updateLink"] = async (id, changes) => {
    const patch = {
      ...(changes.title !== undefined && { title: changes.title }),
      ...(changes.url !== undefined && { url: changes.url }),
      ...(changes.folderId !== undefined && { folder_id: changes.folderId }),
    };
    const { error } = await supabase.from("bookmarks").update(patch).eq("id", id);
    if (error) return console.error("북마크 수정 실패", error);
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  };

  const removeLink = async (id: number) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) return console.error("북마크 삭제 실패", error);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const addFolder = async (name: string) => {
    const { data, error } = await supabase
      .from("folders")
      .insert({ name })
      .select("id, name")
      .single();
    if (error) return console.error("폴더 추가 실패", error);
    setFolders((prev) => [...prev, data]);
  };

  // 폴더를 삭제하면 안의 북마크도 DB에서 함께 삭제된다 (on delete cascade)
  const removeFolder = async (id: number) => {
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) return console.error("폴더 삭제 실패", error);
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setBookmarks((prev) => prev.filter((b) => b.folder_id !== id));
  };

  const renameFolder = async (id: number, name: string) => {
    const target = folders.find((f) => f.id === id);
    if (!target || target.name === name) return;
    const { error } = await supabase
      .from("folders")
      .update({ name })
      .eq("id", id);
    if (error) return console.error("폴더 수정 실패", error);
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  return (
    <LinksContext.Provider
      value={{
        links,
        addLink,
        updateLink,
        removeLink,
        folders,
        addFolder,
        removeFolder,
        renameFolder,
      }}
    >
      {children}
    </LinksContext.Provider>
  );
}
