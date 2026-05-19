import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReclamationStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

const allowedStatuses: ReclamationStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export async function POST(req: Request) {
  try {
    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Payload invalide",
        },
        {
          status: 400,
        }
      );
    }

    const id = body?.id;
    const status = body?.status;

    if (
      typeof id !== "string" ||
      typeof status !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Paramètres invalides",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !allowedStatuses.includes(
        status as ReclamationStatus
      )
    ) {
      return NextResponse.json(
        {
          error: "Statut invalide",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.reclamation.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Réclamation introuvable",
        },
        {
          status: 404,
        }
      );
    }

    const updated =
      await prisma.reclamation.update({
        where: { id },

        data: {
          status:
            status as ReclamationStatus,
        },
      });

    console.log(
      "✅ RECLAMATION UPDATED:",
      updated.id,
      updated.status
    );

    return NextResponse.json({
      success: true,
      reclamation: updated,
    });

  } catch (error) {
    console.error(
      "🔥 UPDATE RECLAMATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur mise à jour",
      },
      {
        status: 500,
      }
    );
  }
}