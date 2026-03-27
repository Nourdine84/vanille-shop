import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "FAILED"
  | "CANCELED";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const status = formData.get("status");
    const trackingNumber = formData.get("trackingNumber");
    const carrier = formData.get("carrier");

    // 🔒 VALIDATION TYPE
    if (typeof id !== "string" || typeof status !== "string") {
      console.error("❌ Invalid payload:", { id, status });

      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // 🔒 VALIDATION STATUS
    const allowedStatuses: OrderStatus[] = [
      "PENDING",
      "PAID",
      "SHIPPED",
      "DELIVERED",
      "FAILED",
      "CANCELED",
    ];

    if (!allowedStatuses.includes(status as OrderStatus)) {
      console.error("❌ Invalid status:", status);

      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // 🔍 CHECK ORDER EXIST
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      console.error("❌ Order not found:", id);

      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // 🔄 UPDATE
    await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        trackingNumber:
          typeof trackingNumber === "string" && trackingNumber.trim() !== ""
            ? trackingNumber
            : null,
        carrier:
          typeof carrier === "string" && carrier.trim() !== ""
            ? carrier
            : null,
      },
    });

    console.log("✅ ORDER UPDATED:", id, status);

    return NextResponse.redirect(
      new URL("/admin", req.url),
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