import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

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
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const formData = await req.formData();

    const id = String(
      formData.get("id") || ""
    ).trim();

    const status = String(
      formData.get("status") || ""
    ).trim();

    const adminNote = String(
      formData.get("adminNote") || ""
    ).trim();

    /* ================= VALIDATION ================= */

    if (!id || !status) {
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

    /* ================= EXISTING ================= */

    const existing =
      await prisma.reclamation.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
        },
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

    /* ================= UPDATE ================= */

    const updated =
      await prisma.reclamation.update({
        where: {
          id,
        },

        data: {
          status:
            status as ReclamationStatus,

          adminNote:
            adminNote.length > 0
              ? adminNote
              : null,
        },
      });

    console.log(
      "\n✅ RECLAMATION UPDATED"
    );

    console.log(
      "🆔 ID:",
      updated.id
    );

    console.log(
      "📌 STATUS:",
      updated.status
    );

    console.log(
      "📝 ADMIN NOTE:",
      updated.adminNote
    );

    /* ================= REDIRECT ================= */

    return NextResponse.redirect(
      new URL(
        `/admin/reclamations/${updated.id}`,
        req.url
      ),
      303
    );

  } catch (error) {
    console.error(
      "🔥 UPDATE RECLAMATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur mise à jour réclamation",
      },
      {
        status: 500,
      }
    );
  }
}