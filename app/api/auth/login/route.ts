import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("LOGIN:", body);

    return NextResponse.json({
      success: true,
      message: "Login OK",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur login" },
      { status: 500 }
    );
  }
}
