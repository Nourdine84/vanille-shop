import { NextResponse } from "next/server";
import { sendShippingEmail } from "@/lib/email";

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
   POST UPDATE ORDER
========================= */
export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX CRITIQUE

    const formData = await req.formData();

    const id = formData.get("id");
    const status = formData.get("status");
    const trackingNumber = formData.get("trackingNumber");
    const carrier = formData.get("carrier");

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
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!existingOrder) {
      console.error("❌ Order not found:", id);

      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    /* =========================
       CLEAN DATA
    ========================= */
    const cleanTracking =
      typeof trackingNumber === "string" && trackingNumber.trim()
        ? trackingNumber.trim()
        : null;

    const cleanCarrier =
      typeof carrier === "string" && carrier.trim()
        ? carrier.trim()
        : null;

    /* =========================
       UPDATE ORDER
    ========================= */
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        trackingNumber: cleanTracking,
        carrier: cleanCarrier,
      },
      select: {
        id: true,
        email: true,
        status: true,
        trackingNumber: true,
        carrier: true,
      },
    });

    /* =========================
       📧 EMAIL SHIPPING (SAFE)
    ========================= */
    const becameShipped =
      existingOrder.status !== "SHIPPED" &&
      updatedOrder.status === "SHIPPED" &&
      updatedOrder.email &&
      updatedOrder.trackingNumber;

    if (becameShipped) {
      try {
        await sendShippingEmail({
          to: updatedOrder.email!,
          orderId: updatedOrder.id,
          trackingNumber: updatedOrder.trackingNumber!,
          carrier: updatedOrder.carrier,
        });

        console.log("📧 Shipping email sent:", updatedOrder.email);
      } catch (emailError) {
        console.error("🔥 SHIPPING EMAIL ERROR:", emailError);
      }
    }

    console.log("✅ ORDER UPDATED:", id, status);

    /* =========================
       REDIRECT ADMIN
    ========================= */
    return NextResponse.redirect(new URL("/admin", req.url), {
      status: 303,
    });

  } catch (error) {
    console.error("🔥 UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}