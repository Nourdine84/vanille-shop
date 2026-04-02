import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendB2BRelanceEmail,
  sendB2BRelanceV2Email,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   CRON B2B RELANCE
========================= */
export async function GET() {
  try {
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
      try {
        const ageHours =
          (now.getTime() - new Date(lead.createdAt).getTime()) /
          (1000 * 60 * 60);

        const payload = {
          name: lead.name || "Client",
          email: lead.email,
          quantity: lead.quantity || "-",
        };

        /* =========================
           RELANCE 1 (24h)
        ========================= */
        if (ageHours > 24 && lead.relanceStep === 0) {
          try {
            await sendB2BRelanceEmail(payload);
          } catch (err) {
            console.error("❌ RELANCE 1 EMAIL ERROR:", err);
          }

          await prisma.b2BRequest.update({
            where: { id: lead.id },
            data: { relanceStep: 1 },
          });

          processed++;
        }

        /* =========================
           RELANCE 2 (48h)
        ========================= */
        else if (ageHours > 48 && lead.relanceStep === 1) {
          try {
            await sendB2BRelanceV2Email(payload);
          } catch (err) {
            console.error("❌ RELANCE 2 EMAIL ERROR:", err);
          }

          await prisma.b2BRequest.update({
            where: { id: lead.id },
            data: { relanceStep: 2 },
          });

          processed++;
        }

        /* =========================
           RELANCE 3 (72h)
           👉 fallback = V2 (safe)
        ========================= */
        else if (ageHours > 72 && lead.relanceStep === 2) {
          try {
            await sendB2BRelanceV2Email(payload); // fallback propre
          } catch (err) {
            console.error("❌ RELANCE 3 EMAIL ERROR:", err);
          }

          await prisma.b2BRequest.update({
            where: { id: lead.id },
            data: { relanceStep: 3 },
          });

          processed++;
        }

      } catch (loopError) {
        console.error("❌ LEAD PROCESS ERROR:", lead.id, loopError);
      }
    }

    console.log("🔁 CRON PROCESSED:", processed);

    return NextResponse.json({
      success: true,
      processed,
      total: leads.length,
    });

  } catch (error) {
    console.error("🔥 CRON ERROR:", error);

    return NextResponse.json(
      { error: "cron failed" },
      { status: 500 }
    );
  }
}