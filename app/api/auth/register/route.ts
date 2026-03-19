import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("REGISTER BODY:", body);

    return NextResponse.json({
      success: true,
      message: "Register OK (temporaire)",
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Erreur register" },
      { status: 500 }
    );
  }
}