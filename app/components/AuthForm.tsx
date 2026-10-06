"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type Field = {
  id: string;
  label: string;
  type: "email" | "password";
  placeholder: string;
  autoComplete: string;
};

type Props = {
  fields: Field[];
  submitLabel: string;
  altText: string;
  altLabel: string;
  altHref: string;
  mode: "login" | "signup";
};

const toKoreanError = (message: string) => {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered"))
    return "이미 가입된 이메일입니다.";
  if (m.includes("password") && m.includes("characters"))
    return "비밀번호는 6자 이상이어야 합니다.";
  if (m.includes("weak")) return "비밀번호가 너무 약합니다.";
  if (m.includes("invalid") && m.includes("email"))
    return "올바른 이메일 형식이 아닙니다.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  return "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
};

export default function AuthForm({
  fields,
  submitLabel,
  altText,
  altLabel,
  altHref,
  mode,
}: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const allFilled =
    fields.every((f) => (values[f.id] ?? "").trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allFilled || loading) return;
    if (mode === "login") {
      setLoading(true);
      const { error } = await createClient().auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      setLoading(false);
      if (error) {
        setToast(
          error.message.toLowerCase().includes("rate limit")
            ? "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."
            : error.message.toLowerCase().includes("not confirmed")
              ? "이메일 인증이 완료되지 않았습니다."
              : "이메일 또는 비밀번호가 올바르지 않습니다.",
        );
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }
    if (values.password !== values["password-confirm"]) {
      setToast("비밀번호가 일치하지 않습니다.");
      return;
    }
    setLoading(true);
    const { data, error } = await createClient().auth.signUp({
      email: values.email.trim(),
      password: values.password,
    });
    setLoading(false);
    if (error) {
      setToast(toKoreanError(error.message));
      return;
    }
    if (!data.session) {
      setToast("이메일로 발송된 인증 링크를 확인해주세요.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const handleKakao = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
    });
    if (error) {
      setLoading(false);
      setToast("카카오 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

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
                type={f.type}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                value={values[f.id] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.id]: e.target.value }))
                }
                className="input-field rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-[14px] py-3 text-base text-[var(--text)]"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={!allFilled || loading}
            className="btn-primary mt-2 rounded-xl bg-[var(--accent)] px-6 py-[14px] text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--text-sub)]"
          >
            {submitLabel}
          </button>
        </form>
        {mode === "login" && (
          <button
            type="button"
            onClick={handleKakao}
            disabled={loading}
            aria-label="카카오 로그인"
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-[#FEE500] px-6 py-[14px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#191919"
                d="M12 3C6.48 3 2 6.58 2 10.99c0 2.85 1.87 5.35 4.68 6.77l-.95 3.5a.4.4 0 0 0 .62.43l4.1-2.72c.51.06 1.03.09 1.55.09 5.52 0 10-3.58 10-7.99S17.52 3 12 3Z"
              />
            </svg>
          </button>
        )}
        {mode === "login" && (
          <p className="mt-5 text-center text-[13px]">
            <Link
              href="/forgot-password"
              className="link-accent font-bold text-[var(--accent)]"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </p>
        )}
        <p
          className={`${mode === "login" ? "mt-2" : "mt-5"} text-center text-[13px] text-[var(--text-sub)]`}
        >
          {altText}{" "}
          <Link href={altHref} className="link-accent font-bold text-[var(--accent)]">
            {altLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}
