import { NextResponse } from "next/server";
import { sendCustomerOrderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   TEST EMAIL (SAFE)
========================= */

export async function GET(req: Request) {
  try {
    // 🔒 Désactivé en production
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Route désactivée en production" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const token = searchParams.get("token");

    if (token !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("📧 TEST EMAIL MANUAL TRIGGER");

    const result = await sendCustomerOrderEmail({
      to: process.env.EMAIL_ADMIN_TO || "test@example.com",
      orderId: "TEST-123",
      totalCents: 1299,
      items: [
        {
          id: "test",
          name: "Vanille Bourbon Premium",
          quantity: 1,
          priceCents: 1299,
          imageUrl: "",
          description: "Produit de test",
          format: "test",
        },
      ],
    });

    console.log("📧 EMAIL SENT:", result);

    return NextResponse.json({
      success: true,
      message: "Email envoyé",
      result,
    });

  } catch (error: any) {
    console.error("❌ TEST EMAIL ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Erreur email" },
      { status: 500 }
    );
  }
}