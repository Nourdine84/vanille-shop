import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = body?.password;

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

    if (password === process.env.ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true });

      res.cookies.set("admin", "true", {
        httpOnly: true,
        secure: true,          // ✅ obligatoire Vercel
        sameSite: "lax",       // ✅ évite blocage cookie
        path: "/",
        maxAge: 60 * 60 * 24,  // ✅ 24h session
      });

      return res;
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}