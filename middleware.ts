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

const ADMIN_SESSION_COOKIE = "admin_session";

/* =========================
   VÉRIF SIGNATURE (Edge / Web Crypto)
   Reproduit exactement lib/admin-auth.ts (HMAC-SHA256, base64url).
========================= */

function b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifyAdminToken(
  token?: string | null
): Promise<boolean> {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    null;

  if (!secret || !token) return false;

  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;

  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);

  if (!payload.startsWith("admin:")) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payload)
  );

  return safeEqual(signature, b64url(mac));
}

export async function middleware(
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
     ADMIN AUTH (session signée)
  ========================= */

  const isAdminPage =
    pathname.startsWith("/admin");

  const isAdminLoginPage =
    pathname.startsWith("/admin/login");

  // APIs sensibles à protéger. On exclut les endpoints d'authentification
  // eux-mêmes (login/logout), sinon impossible de se connecter.
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login") &&
    !pathname.startsWith("/api/admin/logout");

  const isUploadApi =
    pathname.startsWith("/api/upload");

  const needsAdmin =
    (isAdminPage && !isAdminLoginPage) ||
    isAdminApi ||
    isUploadApi;

  if (needsAdmin) {
    const token = request.cookies.get(
      ADMIN_SESSION_COOKIE
    )?.value;

    const ok = await verifyAdminToken(token);

    if (!ok) {
      // API → 401 JSON ; page → redirection vers le login.
      if (isAdminApi || isUploadApi) {
        return NextResponse.json(
          { error: "Accès admin refusé" },
          { status: 401 }
        );
      }

      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
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
    "/api/admin/:path*",
    "/api/upload",
  ],
};