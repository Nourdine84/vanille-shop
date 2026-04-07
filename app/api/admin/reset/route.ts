import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("RESET DEMANDÉ:", body.email);

    return NextResponse.json({
      success: true,
      message: "Email de reset envoyé (simulation)",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}