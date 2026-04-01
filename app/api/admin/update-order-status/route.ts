import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   TYPES
========================= */
type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "FAILED"
  | "CANCELED";

const allowedStatuses: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "FAILED",
  "CANCELED",
];

/* =========================
   UPDATE ORDER STATUS
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

    if (!allowedStatuses.includes(status as OrderStatus)) {
      console.error("❌ Invalid status:", status);

      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    /* =========================
       CHECK EXIST
    ========================= */
    const existing = await prisma.order.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      console.error("❌ Order not found:", id);

      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    /* =========================
       UPDATE
    ========================= */
    await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
      },
    });

    console.log("✅ ORDER STATUS UPDATED:", id, status);

    /* =========================
       REDIRECT
    ========================= */
    return NextResponse.redirect(
      new URL("/admin/orders", req.url),
      { status: 303 }
    );

  } catch (error) {
    console.error("🔥 UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}