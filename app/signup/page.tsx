import type { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = {
  title: "회원가입",
  description: "링크에 가입하고 링크를 폴더별로 정리하세요",
};

export default function SignupPage() {
  return (
    <AuthForm
      fields={[
        { id: "email", label: "이메일", type: "email", placeholder: "이메일을 입력하세요", autoComplete: "email" },
        { id: "password", label: "비밀번호", type: "password", placeholder: "비밀번호를 입력하세요", autoComplete: "new-password" },
        { id: "password-confirm", label: "비밀번호 확인", type: "password", placeholder: "비밀번호를 다시 입력하세요", autoComplete: "new-password" },
      ]}
      submitLabel="회원가입"
      altText="이미 계정이 있으신가요?"
      altLabel="로그인"
      altHref="/login"
      mode="signup"
    />
  );
}
