import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

/* =========================
   TYPES
========================= */

type B2BStatus =
  | "NEW"
  | "CONTACTED"
  | "CLOSED";

const allowedStatuses: B2BStatus[] = [
  "NEW",
  "CONTACTED",
  "CLOSED",
];

/* =========================
   POST UPDATE STATUS
========================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id =
      formData.get("id")?.toString() || "";

    const status =
      formData.get("status")?.toString() || "";

    /* =========================
       VALIDATION
    ========================= */

    if (!id || !status) {
      return NextResponse.json(
        {
          error: "Paramètres manquants",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedStatuses.includes(
        status as B2BStatus
      )
    ) {
      return NextResponse.json(
        {
          error: "Status invalide",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       UPDATE
    ========================= */

    await prisma.b2BRequest.update({
      where: {
        id,
      },

      data: {
        status:
          status as B2BStatus,
      },
    });

    console.log(
      "✅ B2B STATUS UPDATED:",
      id,
      status
    );

    return NextResponse.redirect(
      new URL("/admin/b2b", req.url),
      {
        status: 303,
      }
    );

  } catch (error) {
    console.error(
      "🔥 B2B UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Erreur serveur",
      },
      {
        status: 500,
      }
    );
  }
}