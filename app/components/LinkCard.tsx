import type { LinkItem } from "../types";

export default function LinkCard({ link }: { link: LinkItem }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover flex flex-col gap-1 rounded-2xl bg-[var(--card)] p-5 shadow-[var(--shadow)]"
    >
      <h3 className="truncate text-base font-bold text-[var(--text)]">
        {link.title}
      </h3>
      <p className="truncate text-[13px] leading-[1.4] text-[var(--text-sub)]">
        {link.url}
      </p>
      <span className="mt-3 w-fit rounded-lg bg-[var(--hover-bg)] px-2.5 py-1 text-[13px] font-bold text-[var(--accent)]">
        {link.folder}
      </span>
    </a>
  );
}
