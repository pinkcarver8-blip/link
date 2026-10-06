import Link from "next/link";

export default function AddLinkButton() {
  return (
    <Link
      href="/new"
      className="btn-primary rounded-xl bg-[var(--accent)] px-5 py-2 text-[15px] font-bold text-white"
    >
      + 링크 추가
    </Link>
  );
}
