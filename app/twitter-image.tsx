import { ImageResponse } from "next/og";

export const alt = "링크 - 링크를 폴더별로 저장하고 관리하세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// 기본 폰트에는 한글 글리프가 없어 라틴 문자만 사용
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2ac1bc",
          color: "#ffffff",
          fontSize: 200,
          fontWeight: 800,
          letterSpacing: 8,
        }}
      >
        LINK
      </div>
    ),
    size,
  );
}
