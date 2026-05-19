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

    const orderId = String(
      formData.get("orderId") || ""
    ).trim();

    const statusRaw = String(
      formData.get("status") || ""
    ).trim();

    const trackingNumberRaw = String(
      formData.get("trackingNumber") || ""
    ).trim();

    const carrierRaw = String(
      formData.get("carrier") || ""
    ).trim();

    /* ================= VALIDATION ================= */

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

    if (
      !Object.values(OrderStatus).includes(
        statusRaw as OrderStatus
      )
    ) {
      return NextResponse.json(
        { error: "status invalide" },
        { status: 400 }
      );
    }

    const status = statusRaw as OrderStatus;

    /* ================= CLEAN ================= */

    const trackingNumber =
      trackingNumberRaw.length > 0
        ? trackingNumberRaw
        : null;

    const carrier =
      carrierRaw.length > 0
        ? carrierRaw
        : null;

    /* ================= FIND ORDER ================= */

    const existingOrder =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Commande introuvable" },
        { status: 404 }
      );
    }

    /* ================= UPDATE ================= */

    const updatedOrder =
      await prisma.order.update({
        where: {
          id: orderId,
        },

        data: {
          status,
          trackingNumber,
          carrier,
        },
      });

    console.log("\n📦 ORDER UPDATED");
    console.log("🆔 ORDER:", updatedOrder.id);
    console.log("📌 STATUS:", updatedOrder.status);
    console.log(
      "🚚 TRACKING:",
      updatedOrder.trackingNumber || "-"
    );
    console.log(
      "📮 CARRIER:",
      updatedOrder.carrier || "-"
    );
    console.log("=================================\n");

    /* ================= REDIRECT ================= */

    return NextResponse.redirect(
      new URL("/admin/orders", req.url),
      303
    );

  } catch (error) {
    console.error(
      "🔥 UPDATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur update order",
      },
      {
        status: 500,
      }
    );
  }
}