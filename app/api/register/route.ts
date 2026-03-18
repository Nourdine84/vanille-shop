import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { setUserSession } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = body?.name?.trim() || "";
    const email = body?.email?.trim().toLowerCase() || "";
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe obligatoires." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cet email." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    });

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
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur pendant l'inscription." },
      { status: 500 }
    );
  }
}
