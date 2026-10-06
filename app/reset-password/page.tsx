"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const allFilled = password !== "" && confirm !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFilled || loading) return;
    if (password !== confirm) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) {
      const m = error.message.toLowerCase();
      setToast(
        m.includes("same")
          ? "이전과 다른 비밀번호를 입력해주세요."
          : m.includes("characters")
            ? "비밀번호는 6자 이상이어야 합니다."
            : m.includes("weak")
              ? "비밀번호가 너무 약합니다."
              : "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
      return;
    }
    router.push("/");
    router.refresh();
  };

  const fields = [
    { id: "password", label: "새 비밀번호", placeholder: "새 비밀번호를 입력하세요", value: password, set: setPassword },
    { id: "password-confirm", label: "새 비밀번호 확인", placeholder: "새 비밀번호를 다시 입력하세요", value: confirm, set: setConfirm },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-9">
      {toast && (
        <div
          role="alert"
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl bg-[var(--error)] px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-hover)]"
        >
          {toast}
        </div>
      )}
      <div className="w-full max-w-[400px] rounded-2xl bg-[var(--card)] p-8 shadow-[var(--shadow)]">
        <h1 className="mb-7 text-center text-[26px] font-bold leading-[1.3] text-[var(--text)]">
          🔗 <span className="text-[var(--accent)]">링크</span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
          {fields.map((f) => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <label
                htmlFor={f.id}
                className="text-[13px] font-bold text-[var(--text-sub)]"
              >
                {f.label}
              </label>
              <input
                id={f.id}
                name={f.id}
                type="password"
                placeholder={f.placeholder}
                autoComplete="new-password"
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="input-field rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-[14px] py-3 text-base text-[var(--text)]"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={!allFilled || loading}
            className="btn-primary mt-2 rounded-xl bg-[var(--accent)] px-6 py-[14px] text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)]"
          >
            비밀번호 재설정
          </button>
        </form>
      </div>
    </main>
  );
}
