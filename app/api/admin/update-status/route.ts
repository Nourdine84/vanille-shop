import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   TYPES
========================= */
type Status = "NEW" | "CONTACTED" | "CLOSED";

const allowed: Status[] = ["NEW", "CONTACTED", "CLOSED"];

/* =========================
   UPDATE STATUS
========================= */
export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX CRITIQUE

    const formData = await req.formData();

    const id = formData.get("id");
    const status = formData.get("status");

    /* =========================
       VALIDATION
    ========================= */
    if (typeof id !== "string" || typeof status !== "string") {
      console.error("❌ Invalid payload:", { id, status });

      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (!allowed.includes(status as Status)) {
      console.error("❌ Invalid status:", status);

      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    /* =========================
       UPDATE
    ========================= */
    await prisma.b2BRequest.update({
      where: { id },
      data: { status: status as Status },
    });

    console.log("✅ B2B STATUS UPDATED:", id, status);

    /* =========================
       REDIRECT ADMIN
    ========================= */
    return NextResponse.redirect(
      new URL("/admin/b2b", req.url),
      { status: 303 }
    );

  } catch (error) {
    console.error("🔥 UPDATE STATUS ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}