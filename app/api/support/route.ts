import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  sendSupportAdminEmail,
  sendSupportCustomerEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ================= POST ================= */

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const name = String(
      body.name || ""
    ).trim();

    const email = String(
      body.email || ""
    ).trim();

    const orderId = String(
      body.orderId || ""
    ).trim();

    const subject = String(
      body.subject || ""
    ).trim();

    const message = String(
      body.message || ""
    ).trim();

    /* ================= VALIDATION ================= */

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Tous les champs obligatoires doivent être remplis",
        },
        {
          status: 400,
        }
      );
    }

    /* ================= DB ================= */

    const reclamation =
      await prisma.reclamation.create({
        data: {
          name,
          email,
          orderId:
            orderId || null,
          subject,
          message,
        },
      });

    console.log(
      "📩 RECLAMATION CREATED:",
      reclamation.id
    );

    /* ================= EMAIL ADMIN ================= */

    try {
      await sendSupportAdminEmail({
        name,
        email,
        orderId,
        subject,
        message,
      });
    } catch (err) {
      console.error(
        "❌ ADMIN EMAIL ERROR:",
        err
      );
    }

    /* ================= EMAIL CUSTOMER ================= */

    try {
      await sendSupportCustomerEmail({
        to: email,
        name,
        subject,
        orderId,
      });
    } catch (err) {
      console.error(
        "❌ CUSTOMER EMAIL ERROR:",
        err
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "🔥 SUPPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur serveur support",
      },
      {
        status: 500,
      }
    );
  }
}