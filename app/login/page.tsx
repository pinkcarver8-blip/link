import type { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = {
  title: "로그인",
  description: "링크에 로그인하고 저장한 링크를 확인하세요",
};

export default function LoginPage() {
  return (
    <AuthForm
      fields={[
        { id: "email", label: "이메일", type: "email", placeholder: "이메일을 입력하세요", autoComplete: "email" },
        { id: "password", label: "비밀번호", type: "password", placeholder: "비밀번호를 입력하세요", autoComplete: "current-password" },
      ]}
      submitLabel="로그인"
      altText="계정이 없으신가요?"
      altLabel="회원가입"
      altHref="/signup"
      mode="login"
    />
  );
}
