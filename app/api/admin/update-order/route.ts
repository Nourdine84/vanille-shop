import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendShippingEmail } from "@/lib/email";

export const runtime = "nodejs";

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

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const status = formData.get("status");
    const trackingNumber = formData.get("trackingNumber");
    const carrier = formData.get("carrier");

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

    const cleanTracking =
      typeof trackingNumber === "string" && trackingNumber.trim()
        ? trackingNumber.trim()
        : null;

    const cleanCarrier =
      typeof carrier === "string" && carrier.trim()
        ? carrier.trim()
        : null;

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