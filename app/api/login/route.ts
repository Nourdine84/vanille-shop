import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { setUserSession } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase() || "";
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants invalides." },
        { status: 401 }
      );
    }

    setUserSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur pendant la connexion." },
      { status: 500 }
    );
  }
}
