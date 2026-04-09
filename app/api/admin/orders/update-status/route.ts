import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   UPDATE ORDER STATUS
========================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const orderId = formData.get("orderId") as string;
    const statusRaw = formData.get("status") as string;
    const trackingNumberRaw = formData.get("trackingNumber") as string;
    const carrierRaw = formData.get("carrier") as string;

    /* =========================
       VALIDATION
    ========================= */

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId manquant" },
        { status: 400 }
      );
    }

    if (!statusRaw) {
      return NextResponse.json(
        { error: "status manquant" },
        { status: 400 }
      );
    }

    if (!Object.values(OrderStatus).includes(statusRaw as OrderStatus)) {
      return NextResponse.json(
        { error: "status invalide" },
        { status: 400 }
      );
    }

    const status = statusRaw as OrderStatus;

    /* =========================
       CLEAN DATA
    ========================= */

    const trackingNumber =
      trackingNumberRaw && trackingNumberRaw.trim() !== ""
        ? trackingNumberRaw.trim()
        : null;

    const carrier =
      carrierRaw && carrierRaw.trim() !== ""
        ? carrierRaw.trim()
        : null;

    /* =========================
       UPDATE
    ========================= */

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        trackingNumber,
        carrier,
      },
    });

    console.log("✅ ORDER UPDATED:", updatedOrder.id);

    /* =========================
       REDIRECT BACK (UX CLEAN)
    ========================= */

    return NextResponse.redirect(new URL("/admin/orders", req.url));

  } catch (error) {
    console.error("🔥 UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      { error: "Erreur update order" },
      { status: 500 }
    );
  }
}