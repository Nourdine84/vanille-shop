import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { setUserSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body?.email?.trim().toLowerCase() || "";
    const password = body?.password || "";

    /* ================= VALIDATION ================= */

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email et mot de passe obligatoires.",
        },
        {
          status: 400,
        }
      );
    }

    /* ================= USER ================= */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        {
          error: "Identifiants invalides.",
        },
        {
          status: 401,
        }
      );
    }

    /* ================= PASSWORD ================= */

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Identifiants invalides.",
        },
        {
          status: 401,
        }
      );
    }

    /* ================= SESSION ================= */

    setUserSession(user.id);

    console.log("✅ LOGIN SUCCESS:", user.email);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur login.",
      },
      {
        status: 500,
      }
    );
  }
}