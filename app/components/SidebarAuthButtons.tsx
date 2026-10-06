"use client";

import Link from "next/link";
import { useUser } from "./useUser";

export default function SidebarAuthButtons() {
  const user = useUser();

  if (user !== null) return null;

  return (
    <div className="mt-auto flex flex-col gap-2 pt-4">
      <Link
        href="/login"
        className="btn-primary rounded-xl bg-[var(--accent)] px-6 py-3 text-center text-base font-bold text-white"
      >
        로그인
      </Link>
      <Link
        href="/signup"
        className="btn-secondary rounded-xl bg-[var(--hover-bg)] px-6 py-3 text-center text-base font-bold text-[var(--accent)]"
      >
        회원가입
      </Link>
    </div>
  );
}
