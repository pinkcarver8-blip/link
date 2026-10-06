"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useUser } from "./useUser";

export default function UserMenu() {
  const router = useRouter();
  const user = useUser();

  if (!user) return null;

  const logout = async () => {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <span className="max-w-[200px] truncate text-[13px] font-bold text-[var(--text-sub)]">
        {user.email}
      </span>
      <button
        type="button"
        onClick={logout}
        className="btn-secondary rounded-xl bg-[var(--hover-bg)] px-4 py-2 text-[13px] font-bold text-[var(--accent)]"
      >
        로그아웃
      </button>
    </div>
  );
}
