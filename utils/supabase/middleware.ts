import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const AUTH_PAGES = ["/login", "/signup"];
// 로그인 여부와 관계없이 접근 가능한 경로 (비밀번호 재설정 흐름)
const OPEN_PAGES = ["/forgot-password", "/auth/callback"];

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // 세션 갱신 + 로그인 여부 확인 (서버에서 토큰을 검증하는 getUser 사용)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = AUTH_PAGES.includes(request.nextUrl.pathname);
  const { pathname } = request.nextUrl;
  // 공유 미리보기용 썸네일은 크롤러(비로그인)도 접근 가능해야 함
  const isShareImage =
    pathname.startsWith("/opengraph-image") ||
    pathname.startsWith("/twitter-image");
  if (OPEN_PAGES.includes(pathname) || isShareImage) {
    return supabaseResponse;
  }
  if (!user && !isAuthPage) {
    return redirectWithCookies(request, supabaseResponse, "/login");
  }
  if (user && isAuthPage) {
    return redirectWithCookies(request, supabaseResponse, "/");
  }
  return supabaseResponse;
};

function redirectWithCookies(
  request: NextRequest,
  from: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirect = NextResponse.redirect(url);
  from.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}
