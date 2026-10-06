"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLinks } from "./LinksProvider";

export default function LinkForm() {
  const router = useRouter();
  const { addLink } = useLinks();
  const [url, setUrl] = useState("");

  return (
    <section className="flex-1 overflow-y-auto p-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addLink(url.trim());
          router.push("/");
        }}
        className="mx-auto flex max-w-xl gap-3 rounded-2xl bg-[var(--card)] p-5 shadow-[var(--shadow)]"
      >
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="input-field min-w-0 flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3.5 py-3 text-base text-[var(--text)]"
        />
        <button
          type="submit"
          className="btn-primary rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-bold text-white"
        >
          저장
        </button>
      </form>
    </section>
  );
}
