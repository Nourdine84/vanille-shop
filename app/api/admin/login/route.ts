import { NextResponse } from "next/server";

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
       COOKIE SAFE (🔥 FIX CRITIQUE)
    ========================= */
    const res = NextResponse.json({ success: true });

    res.cookies.set({
      name: "admin",
      value: "true",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // ✅ FIX IMPORTANT
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
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