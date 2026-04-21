import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendB2BAdminEmail,
  sendB2BCustomerAckEmail,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let data: any;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await req.json();
    } else {
      const form = await req.formData();

      data = {
        name: form.get("name")?.toString(),
        email: form.get("email")?.toString(),
        company: form.get("company")?.toString(),
        quantity: form.get("quantity")?.toString(),
        message: form.get("message")?.toString(),
      };
    }

    const { name, email, company, quantity, message } = data;

    if (!name || !email || !quantity) {
      return NextResponse.json(
        { error: "Champs requis" },
        { status: 400 }
      );
    }

    console.log("📩 NEW B2B:", data);

    await prisma.b2BRequest.create({
      data: {
        name,
        email,
        company,
        quantity,
        message,
      },
    });

    /* ===== EMAIL ADMIN ===== */

    try {
      const resAdmin = await sendB2BAdminEmail({
        name,
        email,
        company,
        quantity,
        message,
      });

      console.log("📧 ADMIN B2B:", resAdmin);
    } catch (err) {
      console.error("❌ ADMIN B2B EMAIL ERROR:", err);
    }

    /* ===== EMAIL CLIENT ===== */

    try {
      const resClient = await sendB2BCustomerAckEmail({
        name,
        email,
        company,
        quantity,
        message,
      });

      console.log("📧 CLIENT B2B:", resClient);
    } catch (err) {
      console.error("❌ CLIENT B2B EMAIL ERROR:", err);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ B2B ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}