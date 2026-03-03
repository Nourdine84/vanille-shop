import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    console.log("1️⃣ Début de la requête");
    const { email, password, name } = await req.json();
    console.log("2️⃣ Données reçues:", { email, name });

    if (!email || !password) {
      console.log("3️⃣ Champs manquants");
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    console.log("4️⃣ Recherche utilisateur existant");
    const existingUser = await (prisma as any).user.findUnique({
      where: { email },
    });
    console.log("5️⃣ Résultat recherche:", existingUser);

    if (existingUser) {
      console.log("6️⃣ Utilisateur déjà existant");
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    console.log("7️⃣ Hash du mot de passe");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("8️⃣ Création utilisateur");
    await (prisma as any).user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    console.log("9️⃣ Utilisateur créé avec succès");
    return NextResponse.json(
      { message: "Utilisateur créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔴 Erreur catch:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}