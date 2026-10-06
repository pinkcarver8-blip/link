"use client";

import { useState } from "react";
import FolderItem from "./FolderItem";
import SidebarAuthButtons from "./SidebarAuthButtons";
import { useLinks } from "./LinksProvider";
import type { Folder } from "../types";

export default function Sidebar() {
  const { folders, removeFolder, renameFolder } = useLinks();
  const [target, setTarget] = useState<Folder | null>(null);
  const [editTarget, setEditTarget] = useState<Folder | null>(null);
  const [editName, setEditName] = useState("");

  const closeEdit = () => setEditTarget(null);

  return (
    <aside className="flex w-56 shrink-0 flex-col bg-[var(--card)] p-4 shadow-[1px_0_0_rgba(0,0,0,0.06)]">
      <nav className="flex flex-col gap-1">
        <FolderItem name="All" active />
        <p className="mt-5 mb-1 px-3 text-[13px] font-bold text-[var(--text-sub)]">
          폴더
        </p>
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            name={folder.name}
            onEdit={() => {
              setEditTarget(folder);
              setEditName(folder.name);
            }}
            onDelete={() => setTarget(folder)}
          />
        ))}
      </nav>

      <SidebarAuthButtons />

      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          onClick={closeEdit}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label="폴더 이름 수정"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && closeEdit()}
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = editName.trim();
              if (!trimmed) return;
              renameFolder(editTarget.id, trimmed);
              closeEdit();
            }}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[var(--shadow-hover)]"
          >
            <h2 className="text-xl font-bold leading-[1.4] text-[var(--text)]">
              폴더 이름 수정
            </h2>
            <input
              autoFocus
              onFocus={(e) => e.target.select()}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="폴더 이름"
              className="input-field rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3.5 py-3 text-base text-[var(--text)]"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeEdit}
                className="btn-secondary flex-1 rounded-xl bg-[var(--hover-bg)] px-6 py-3 text-base font-bold text-[var(--accent)]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!editName.trim()}
                className="btn-primary flex-1 rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)]"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}

      {target && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          onClick={() => setTarget(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="폴더 삭제 확인"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && setTarget(null)}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[var(--shadow-hover)]"
          >
            <h2 className="text-xl font-bold leading-[1.4] text-[var(--text)]">
              폴더 삭제
            </h2>
            <p className="text-base text-[var(--text)]">
              <span className="font-bold">&lsquo;{target.name}&rsquo;</span>{" "}
              폴더를 삭제할까요?
              <br />
              <span className="text-[13px] text-[var(--text-sub)]">
                폴더 안의 링크도 함께 삭제됩니다.
              </span>
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setTarget(null)}
                className="btn-secondary flex-1 rounded-xl bg-[var(--hover-bg)] px-6 py-3 text-base font-bold text-[var(--accent)]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  removeFolder(target.id);
                  setTarget(null);
                }}
                className="btn-danger flex-1 rounded-xl bg-[var(--error)] px-6 py-3 text-base font-bold text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
