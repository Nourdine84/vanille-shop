import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   DELETE PRODUCT
========================= */
export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX CRITIQUE

    const formData = await req.formData();
    const id = formData.get("id");

    /* =========================
       VALIDATION
    ========================= */
    if (typeof id !== "string") {
      console.error("❌ Invalid payload:", { id });

      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    /* =========================
       DELETE
    ========================= */
    await prisma.product.delete({
      where: { id },
    });

    console.log("🗑️ PRODUCT DELETED:", id);

    /* =========================
       REDIRECT ADMIN
    ========================= */
    return NextResponse.redirect(
      new URL("/admin/products", req.url),
      { status: 303 }
    );

  } catch (error: any) {
    console.error("🔥 DELETE PRODUCT ERROR:", error);

    /* =========================
       SAFE ERROR HANDLING
    ========================= */
    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}