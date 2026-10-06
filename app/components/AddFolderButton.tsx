"use client";

import { useState } from "react";
import { useLinks } from "./LinksProvider";

export default function AddFolderButton() {
  const { addFolder } = useLinks();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const close = () => {
    setOpen(false);
    setName("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary rounded-xl bg-[var(--hover-bg)] px-5 py-2 text-[15px] font-bold text-[var(--accent)]"
      >
        + 새 폴더
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          onClick={close}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-label="새 폴더"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && close()}
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = name.trim();
              if (!trimmed) return;
              addFolder(trimmed);
              close();
            }}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[var(--shadow-hover)]"
          >
            <h2 className="text-xl font-bold leading-[1.4] text-[var(--text)]">
              새 폴더
            </h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="폴더 이름"
              className="input-field rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3.5 py-3 text-base text-[var(--text)]"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={close}
                className="btn-secondary flex-1 rounded-xl bg-[var(--hover-bg)] px-6 py-3 text-base font-bold text-[var(--accent)]"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="btn-primary flex-1 rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)]"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
