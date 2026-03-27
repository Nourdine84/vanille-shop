import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.formData();

    const id = String(body.get("id"));
    const trackingNumber = String(body.get("trackingNumber") || "");
    const carrier = String(body.get("carrier") || "");

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.order.update({
      where: { id },
      data: {
        trackingNumber,
        carrier,
        status: "SHIPPED",
      },
    });

    return NextResponse.redirect(new URL("/admin", req.url));

  } catch (error) {
    console.error("TRACKING ERROR:", error);

    return NextResponse.json(
      { error: "Erreur update tracking" },
      { status: 500 }
    );
  }
}