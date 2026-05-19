import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* =========================
   USER SESSION
========================= */

const USER_SESSION_COOKIE =
  "vanille_or_user";

/* =========================
   ADMIN SESSION
========================= */

const ADMIN_COOKIE = "admin";

export function middleware(
  request: NextRequest
) {
  const { pathname } =
    request.nextUrl;

  /* =========================
     USER AUTH
  ========================= */

  const userSession =
    request.cookies.get(
      USER_SESSION_COOKIE
    )?.value;

  const isAuthenticated =
    Boolean(userSession);

  const protectedRoutes = [
    "/account",
  ];

  const authRoutes = [
    "/login",
    "/register",
  ];

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(route)
    );

  const isAuthRoute =
    authRoutes.some((route) =>
      pathname.startsWith(route)
    );

  if (
    isProtectedRoute &&
    !isAuthenticated
  ) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  if (
    isAuthRoute &&
    isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL(
        "/account",
        request.url
      )
    );
  }

  /* =========================
     ADMIN AUTH
  ========================= */

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isAdminLogin =
    pathname.startsWith(
      "/admin/login"
    );

  const adminSession =
    request.cookies.get(
      ADMIN_COOKIE
    )?.value;

  const isAdminAuthenticated =
    adminSession === "true";

  if (
    isAdminRoute &&
    !isAdminLogin &&
    !isAdminAuthenticated
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

/* =========================
   MATCHER
========================= */

export const config = {
  matcher: [
    "/account/:path*",
    "/login",
    "/register",

    "/admin/:path*",
  ],
};