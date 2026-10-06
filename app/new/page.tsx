import type { Metadata } from "next";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import LinkForm from "../components/LinkForm";

export const metadata: Metadata = {
  title: "링크 추가",
  description: "새 링크를 저장하고 폴더로 정리하세요",
};

export default function NewLinkPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <LinkForm />
      </div>
    </div>
  );
}
