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
   UPDATE ORDER
========================= */
export async function POST(req: Request) {
  try {
    const prisma = (await import("@/lib/prisma")).prisma as any;

    const formData = await req.formData();

    const orderId = formData.get("orderId")?.toString();
    const status = formData.get("status")?.toString();
    const trackingNumber = formData.get("trackingNumber")?.toString();
    const carrier = formData.get("carrier")?.toString();

    /* =========================
       VALIDATION
    ========================= */
    if (!orderId || !status) {
      console.error("❌ Missing fields:", { orderId, status });

      return NextResponse.json(
        { error: "Missing fields" },
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
      where: { id: orderId },
      select: { id: true },
    });

    if (!existing) {
      console.error("❌ Order not found:", orderId);

      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    /* =========================
       UPDATE DATA (SMART)
    ========================= */
    const updateData: any = {
      status: status as OrderStatus,
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (carrier) {
      updateData.carrier = carrier;
    }

    await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    console.log("✅ ORDER UPDATED:", orderId, updateData);

    /* =========================
       REDIRECT UX CLEAN
    ========================= */
    return NextResponse.redirect(
      new URL("/admin/orders?success=1", req.url),
      { status: 303 }
    );

  } catch (error) {
    console.error("🔥 UPDATE ORDER ERROR:", error);

    return NextResponse.redirect(
      new URL("/admin/orders?error=1", req.url),
      { status: 303 }
    );
  }
}