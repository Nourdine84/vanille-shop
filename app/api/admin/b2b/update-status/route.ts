import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ FIX CRITIQUE

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/* =========================
   TYPES
========================= */
type B2BStatus = "NEW" | "CONTACTED" | "CLOSED";

const allowedStatuses: B2BStatus[] = ["NEW", "CONTACTED", "CLOSED"];

/* =========================
   POST UPDATE STATUS
========================= */
export async function POST(req: Request) {
  try {
    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const { id, status } = body;

    /* =========================
       VALIDATION
    ========================= */
    if (typeof id !== "string" || typeof status !== "string") {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status as B2BStatus)) {
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
      data: { status: status as B2BStatus },
    });

    console.log("✅ B2B STATUS UPDATED:", id, status);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 B2B UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}