"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; error: boolean } | null>(
    searchParams.get("error") === "expired"
      ? { text: "링크가 만료되었습니다. 다시 요청해주세요.", error: true }
      : null,
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` },
    );
    setLoading(false);
    if (error) {
      const m = error.message.toLowerCase();
      setToast({
        text:
          m.includes("rate limit") || m.includes("too many")
            ? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
            : m.includes("invalid") && m.includes("email")
              ? "올바른 이메일 형식이 아닙니다."
              : "메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",
        error: true,
      });
      return;
    }
    setToast({
      text: "비밀번호 재설정 링크를 이메일로 발송했습니다.",
      error: false,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-9">
      {toast && (
        <div
          role="alert"
          className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-hover)] ${
            toast.error ? "bg-[var(--error)]" : "bg-[var(--accent)]"
          }`}
        >
          {toast.text}
        </div>
      )}
      <div className="w-full max-w-[400px] rounded-2xl bg-[var(--card)] p-8 shadow-[var(--shadow)]">
        <h1 className="mb-2 text-center text-[26px] font-bold leading-[1.3] text-[var(--text)]">
          🔗 <span className="text-[var(--accent)]">링크</span>
        </h1>
        <p className="mb-7 text-center text-[13px] text-[var(--text-sub)]">
          가입한 이메일을 입력하면 비밀번호 재설정 링크를 보내드려요.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[13px] font-bold text-[var(--text-sub)]"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-[14px] py-3 text-base text-[var(--text)]"
            />
          </div>
          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="btn-primary mt-2 rounded-xl bg-[var(--accent)] px-6 py-[14px] text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)]"
          >
            비밀번호 리셋 링크 발송
          </button>
        </form>
        <p className="mt-5 text-center text-[13px] text-[var(--text-sub)]">
          <Link href="/login" className="link-accent font-bold text-[var(--accent)]">
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
