import { NextResponse } from "next/server";
import { signAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body?.password;

    /* =========================
       VALIDATION
    ========================= */
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (!process.env.ADMIN_PASSWORD) {
      console.error("❌ ADMIN_PASSWORD not set");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* =========================
       COOKIE DE SESSION SIGNÉ
    ========================= */
    const token = signAdminToken();

    if (!token) {
      console.error("❌ ADMIN session secret manquant");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });

    // Nettoie l'ancien cookie non signé s'il traîne.
    res.cookies.set({
      name: "admin",
      value: "",
      path: "/",
      maxAge: 0,
    });

    console.log("✅ ADMIN LOGIN SUCCESS");

    return res;

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}