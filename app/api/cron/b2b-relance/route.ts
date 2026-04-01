import { NextResponse } from "next/server";
import {
  sendB2BRelanceEmail,
  sendB2BRelanceV2Email,
  sendB2BRelanceV3Email,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX

    const now = new Date();

    const leads = await prisma.b2BRequest.findMany({
      where: {
        status: {
          in: ["NEW", "CONTACTED"],
        },
      },
    });

    let processed = 0;

    for (const lead of leads) {
      const ageHours =
        (now.getTime() - new Date(lead.createdAt).getTime()) /
        (1000 * 60 * 60);

      /* =========================
         RELANCE 1
      ========================= */
      if (ageHours > 24 && lead.relanceStep === 0) {
        await sendB2BRelanceEmail(lead);

        await prisma.b2BRequest.update({
          where: { id: lead.id },
          data: { relanceStep: 1 },
        });

        processed++;
      }

      /* =========================
         RELANCE 2
      ========================= */
      else if (ageHours > 48 && lead.relanceStep === 1) {
        await sendB2BRelanceV2Email(lead);

        await prisma.b2BRequest.update({
          where: { id: lead.id },
          data: { relanceStep: 2 },
        });

        processed++;
      }

      /* =========================
         RELANCE 3
      ========================= */
      else if (ageHours > 72 && lead.relanceStep === 2) {
        await sendB2BRelanceV3Email(lead);

        await prisma.b2BRequest.update({
          where: { id: lead.id },
          data: { relanceStep: 3 },
        });

        processed++;
      }
    }

    console.log("🔁 CRON PROCESSED:", processed);

    return NextResponse.json({
      success: true,
      processed,
    });

  } catch (error) {
    console.error("🔥 CRON ERROR:", error);

    return NextResponse.json(
      { error: "cron failed" },
      { status: 500 }
    );
  }
}